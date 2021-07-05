import ejs from 'ejs'
import { Queue } from 'bull'
import { SentMessageInfo, Transporter } from 'nodemailer'

interface MailContentItem {
	content: string
	href?: string
	type: 'HEADING' | 'LINE' | 'ACTION'
}

interface User {
	email: string
}

class Mailer {
	private _user: User | any
	private _mailContent: MailContentItem[] = []
	private _queue: null | Queue<any> = null
	private _transport: Transporter<SentMessageInfo>
	private _mailOptions: {
		from?: string
		to?: string
		subject?: string
		html?: string
	} = {}

	constructor(user: User) {
		this._user = user

		this._mailOptions.from = process.env.SEND_MAIL_FROM
		this._mailOptions.to = this._user.email
	}

	public subject(subject: string): this {
		this._mailOptions.subject = subject
		return this
	}

	public heading(content: string): this {
		this._mailContent.push({ content, type: 'HEADING' })
		return this
	}

	public line(content: string): this {
		this._mailContent.push({ content, type: 'LINE' })
		return this
	}

	public action(content: string, href: string): this {
		this._mailContent.push({ content, href, type: 'ACTION' })
		return this
	}

	public queue(queue: Queue<any>): this {
		this._queue = queue
		return this
	}

	public sendMail(
		transport: Transporter<SentMessageInfo>,
		templateName?: string
	): void {
		if (!this._mailOptions.subject || !this._user || !transport) return

		const template = templateName || 'email.template.ejs'

		ejs
			.renderFile(`dist/messages/templates/${template}`, {
				content: this._mailContent,
			})
			.then((html): any => {
				this._mailOptions.html = html

				if (this._queue)
					return this._queue.add({
						mailOptions: this._mailOptions,
						transport,
					})

				return transport.sendMail(this._mailOptions, err => {
					if (err) console.error(`Nodemailer error: ${err}`)
				})
			})
			.catch(console.error)
	}
}

export default Mailer
