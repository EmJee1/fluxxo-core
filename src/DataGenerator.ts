import {
	Config,
	names,
	uniqueNamesGenerator,
	colors,
	languages,
} from 'unique-names-generator'
import { hashSync } from 'bcrypt'

class DataGenerator {
	private emailExt = ['.com', '.nl', '.org', '.de', '.it']
	private emailDomain = ['@outlook', '@gmail', '@kpnmail', '@google']
	private uniqueNamesConfig: Config = {
		dictionaries: [names, names],
		separator: ' ',
		length: 2,
		style: 'capital',
	}

	get user() {
		const { email, name, password, hashedPassword } = this
		return { email, name, password, hashedPassword }
	}

	get email(): string {
		return (
			uniqueNamesGenerator({
				...this.uniqueNamesConfig,
				separator: '-',
				style: 'lowerCase',
			}) +
			this.emailDomain[
				Math.floor(Math.random() * this.emailDomain.length)
			] +
			this.emailExt[Math.floor(Math.random() * this.emailExt.length)]
		)
	}

	get name(): string {
		return uniqueNamesGenerator({ ...this.uniqueNamesConfig })
	}

	get password(): string {
		return uniqueNamesGenerator({
			...this.uniqueNamesConfig,
			dictionaries: [colors, languages],
			separator: '_',
		})
	}

	get hashedPassword(): string {
		return hashSync(
			uniqueNamesGenerator({
				...this.uniqueNamesConfig,
				dictionaries: [colors, languages],
				separator: '_',
			}),
			10
		)
	}
}

export default DataGenerator
