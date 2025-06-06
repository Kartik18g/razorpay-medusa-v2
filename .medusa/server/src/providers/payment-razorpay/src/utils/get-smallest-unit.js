"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSmallestUnit = getSmallestUnit;
exports.getAmountFromSmallestUnit = getAmountFromSmallestUnit;
const utils_1 = require("@medusajs/framework/utils");
function getCurrencyMultiplier(currency) {
    const currencyMultipliers = {
        0: [
            "BIF",
            "CLP",
            "DJF",
            "GNF",
            "JPY",
            "KMF",
            "KRW",
            "MGA",
            "PYG",
            "RWF",
            "UGX",
            "VND",
            "VUV",
            "XAF",
            "XOF",
            "XPF"
        ],
        3: ["BHD", "IQD", "JOD", "KWD", "OMR", "TND"]
    };
    currency = currency.toUpperCase();
    let power = 2;
    for (const [key, value] of Object.entries(currencyMultipliers)) {
        if (value.includes(currency)) {
            power = parseInt(key, 10);
            break;
        }
    }
    return Math.pow(10, power);
}
/**
 * Converts an amount to the format required by Stripe based on currency.
 * https://docs.stripe.com/currencies
 * @param {BigNumberInput} amount - The amount to be converted.
 * @param {string} currency - The currency code (e.g., 'USD', 'JOD').
 * @returns {number} - The converted amount in the smallest currency unit.
 */
function getSmallestUnit(amount, currency) {
    const multiplier = getCurrencyMultiplier(currency);
    const amount_ = Math.round(new utils_1.BigNumber(utils_1.MathBN.mult(amount, multiplier)).numeric) /
        multiplier;
    const smallestAmount = new utils_1.BigNumber(utils_1.MathBN.mult(amount_, multiplier));
    let numeric = smallestAmount.numeric;
    // Check if the currency requires rounding to the nearest ten
    if (multiplier === 1e3) {
        numeric = Math.ceil(numeric / 10) * 10;
    }
    return parseInt(numeric.toString().split(".").shift(), 10);
}
/**
 * Converts an amount from the smallest currency unit to the standard unit based on currency.
 * @param {BigNumberInput} amount - The amount in the smallest currency unit.
 * @param {string} currency - The currency code (e.g., 'USD', 'JOD').
 * @returns {number} - The converted amount in the standard currency unit.
 */
function getAmountFromSmallestUnit(amount, currency) {
    const multiplier = getCurrencyMultiplier(currency);
    const standardAmount = new utils_1.BigNumber(utils_1.MathBN.div(amount, multiplier));
    return standardAmount.numeric;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXNtYWxsZXN0LXVuaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3BheW1lbnQtcmF6b3JwYXkvc3JjL3V0aWxzL2dldC1zbWFsbGVzdC11bml0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBNENBLDBDQW1CQztBQVFELDhEQU9DO0FBN0VELHFEQUE4RDtBQUU5RCxTQUFTLHFCQUFxQixDQUFDLFFBQVE7SUFDbkMsTUFBTSxtQkFBbUIsR0FBRztRQUN4QixDQUFDLEVBQUU7WUFDQyxLQUFLO1lBQ0wsS0FBSztZQUNMLEtBQUs7WUFDTCxLQUFLO1lBQ0wsS0FBSztZQUNMLEtBQUs7WUFDTCxLQUFLO1lBQ0wsS0FBSztZQUNMLEtBQUs7WUFDTCxLQUFLO1lBQ0wsS0FBSztZQUNMLEtBQUs7WUFDTCxLQUFLO1lBQ0wsS0FBSztZQUNMLEtBQUs7WUFDTCxLQUFLO1NBQ1I7UUFDRCxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztLQUNoRCxDQUFDO0lBRUYsUUFBUSxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNsQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDZCxLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUM7UUFDN0QsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7WUFDM0IsS0FBSyxHQUFHLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDMUIsTUFBTTtRQUNWLENBQUM7SUFDTCxDQUFDO0lBQ0QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsZUFBZSxDQUMzQixNQUFzQixFQUN0QixRQUFnQjtJQUVoQixNQUFNLFVBQVUsR0FBRyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVuRCxNQUFNLE9BQU8sR0FDVCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksaUJBQVMsQ0FBQyxjQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUNsRSxVQUFVLENBQUM7SUFFZixNQUFNLGNBQWMsR0FBRyxJQUFJLGlCQUFTLENBQUMsY0FBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUV2RSxJQUFJLE9BQU8sR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDO0lBQ3JDLDZEQUE2RDtJQUM3RCxJQUFJLFVBQVUsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNyQixPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzNDLENBQUM7SUFFRCxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2hFLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILFNBQWdCLHlCQUF5QixDQUNyQyxNQUFzQixFQUN0QixRQUFnQjtJQUVoQixNQUFNLFVBQVUsR0FBRyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuRCxNQUFNLGNBQWMsR0FBRyxJQUFJLGlCQUFTLENBQUMsY0FBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNyRSxPQUFPLGNBQWMsQ0FBQyxPQUFPLENBQUM7QUFDbEMsQ0FBQyJ9