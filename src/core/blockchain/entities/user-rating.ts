export class UserRating {
  rating: number;

  isActive: boolean;

  constructor(userRating: any) {
    this.rating = userRating.rating;
    this.isActive = userRating.isActive;
  }
}
