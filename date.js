export default class date{
	static today = new Date();
	static getDate() {
		const options = {
			weekday: "long",
			day: "numeric",
			month: "long",
		}
		return this.today.toLocaleDateString("en-US", options)
	}
	static getDay()  {
		const options = {
			weekday: "long"
		}
		return this.today.toLocaleDateString("en-US", options)
	}
}

