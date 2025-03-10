// Load the JSON data directly
const jsonData = {
    "DateFormatCulture": "",
    "FeaturedFunds": [14, 32, 43, 472],
    "ReportID": 1570535,
    "Funds": [
        {
            "FundName": "Absolute Return Bond",
            "FundId": "83",
            "HyphenatedFundName": "pgim-absolute-return-bond-fund",
            "TAFundId": "1044",
            "MinimumInceptionDate": "03/30/2011"
        },
        {
            "FundName": "Balanced",
            "FundId": "37",
            "HyphenatedFundName": "pgim-balanced-fund",
            "TAFundId": "0296",
            "MinimumInceptionDate": "01/04/1993"
        },
        {
            "FundName": "California Muni Income",
            "FundId": "2",
            "HyphenatedFundName": "pgim-california-muni-income-fund",
            "TAFundId": "0006",
            "MinimumInceptionDate": "12/03/1990"
        },
        {
            "FundName": "Conservative Retirement Spending",
            "FundId": "852",
            "HyphenatedFundName": "pgim-conservative-retirement-spending-fund",
            "TAFundId": "2152",
            "MinimumInceptionDate": "04/03/2024"
        },
        {
            "FundName": "Core Bond",
            "FundId": "24",
            "HyphenatedFundName": "pgim-core-bond-fund",
            "TAFundId": "1128",
            "MinimumInceptionDate": "01/05/1993"
        },
        {
            "FundName": "Core Conservative Bond",
            "FundId": "708",
            "HyphenatedFundName": "pgim-core-conservative-bond-fund",
            "TAFundId": "2008",
            "MinimumInceptionDate": "03/01/2022"
        }
    ]
};

// Function to process the JSON data
function loadFundData() {
    return jsonData.Funds.map(fund => ({
        name: fund.FundName,
        id: fund.FundId,
        inceptionDate: fund.MinimumInceptionDate
    }));
}

// Generate years from current year back to 2000
const currentYear = new Date().getFullYear();
const years = Array.from({length: currentYear - 1999}, (_, i) => currentYear - i);

// Months array
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]; 