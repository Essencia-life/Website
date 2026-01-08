export class LatLng {
	public readonly lat: number;
	public readonly lng: number;
	constructor(lat: number, lng: number) {
		this.lat = lat;
		this.lng = lng;
	}

	toString(): string {
		return `${this.lat}, ${this.lng}`;
	}

	valueOf(): string {
		return this.toString();
	}
}
