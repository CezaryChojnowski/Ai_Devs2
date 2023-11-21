import RateResponse from "./RateResponse";

export default interface CurrencyResponse {
    table: string;
    currency: string;
    code: string;
    rates: RateResponse[];
}