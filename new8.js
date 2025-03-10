document.addEventListener("DOMContentLoaded", function () {

    const component = document.querySelector('.performance-table-component');
    const tableRowsContainer = component.querySelector('.table-rows');
    const marketPrice = tableRowsContainer.getAttribute('data-market-price');
    const navPrice = tableRowsContainer.getAttribute('data-nav-price');
    const jsonData = JSON.parse(component.getAttribute('data-json'));


	// Function to get ETFYield data for a specific FundClassID
	const getETFYields = (fundClassID) => {
		return data.funddata.ETFYields.find(yieldData => yieldData.FundClassID === fundClassID) || {};
	};
	
	// Function to get Fund data for a specific FundClassID
	const getFundClass = (fundClassID) => {
		return data.common.ReportFundClass.find(fundClassData => fundClassData.FundClassID === fundClassID) || {};
	};
	
	// Function to get ETFNav data for a specific FundClassID
	const getETFNav = (fundClassID) => {
		return data.funddata.ETFNAV.find(etfNav => etfNav.FundClassID === fundClassID) || {};
	};
	
	// Function to get MPRBenchmark data for a specific TAFundID
	const getMPRBenchmark = (taFundID) => {
		return data.common.MPRBenchmark.find(mprBenchmark => mprBenchmark.TAFundID === taFundID) || {};
	};
	
	// Function to get BenchmarkPerformanceMonthly data for a specific FundBenchmarkID
	const getBenchmarkPerformanceMonthly = (fundBenchmarkID) => {
		return data.funddata.BenchmarkPerformanceMonthly.find(benchmarkPerformanceMonthly => benchmarkPerformanceMonthly.FundBenchmarkID === fundBenchmarkID) || {};
	};
	
	// Function to get BenchmarkPerformanceQuarterly data for a specific FundBenchmarkID
	const BenchmarkPerformanceQuarterly = (fundBenchmarkID) => {
		return data.funddata.BenchmarkPerformanceQuarterly.find(benchmarkPerformanceQuarterly => benchmarkPerformanceQuarterly.FundBenchmarkID === fundBenchmarkID) || {};
	};
	
	// Function to convert TotalNetAssets to millions
	function convertToMillions(number) {
	  const millions = number / 1000000;
	  return millions.toFixed(2);
	}
	
	// Function to format date to MM/DD/YYYY
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
	};
	
    // Function to populate table rows for standard data
    function populateStandardData(data, showBenchMarks, showLipper, returnsValue) {
		data.forEach(row => {
			const etfYield = getETFYields(row.FundClassID);
			const fundClassData = getFundClass(row.FundClassID);
			const etfNav = getETFNav(row.FundClassID);
            const tableRow = `
                <tr>
                    <td rowspan="2">${row.Ticker}</td>
                    <td rowspan="2">${fundClassData.ShortName}</td>
                    <td rowspan="2">${convertToMillions(etfNav.TotalNetAssets)}</td>
					<td>${navPrice}</td>
                    <td>${row.YTDReturn ? row.YTDReturn : "-"}</td>
                    <td>${row.OneMonthReturn ? row.OneMonthReturn : "-"}</td>
                    <td>${row.ThreeMonthReturn ? row.ThreeMonthReturn : "-"}</td>
					<td>${row.OneYearReturn ? row.OneYearReturn : "-"}</td>
					<td>${row.ThreeYearReturn ? row.ThreeYearReturn : "-"}</td>
					<td>${row.FiveYearReturn ? row.FiveYearReturn : "-"}</td>
					<td>${row.TenYearReturn ? row.TenYearReturn : "-"}</td>
                    <td>${row.InceptionReturn ? row.InceptionReturn : "-"}<br>${row.InceptionDate ? formatDate(row.InceptionDate) : "-"}</td>
					<td>${etfYield.NAVDistYield ? etfYield.NAVDistYield : "-"}</td>
                    <td>${etfYield.SECYieldPercentage ? etfYield.SECYieldPercentage : "-"}</td>
                    <td>${etfYield.UnsbSECYieldPercentage ? etfYield.UnsbSECYieldPercentage : "-"}</td>
					<td rowspan="2">${fundClassData.Expenseratio}</td>
                </tr>
				<tr>
                    <td>${marketPrice}</td>
                    <td>${row.mkt_YTDReturn ? row.mkt_YTDReturn : "-"}</td>
                    <td>${row.mkt_OneMonthReturn ? row.mkt_OneMonthReturn : "-"}</td>
                    <td>${row.mkt_ThreeMonthReturn ? row.mkt_ThreeMonthReturn : "-"}</td>
					<td>${row.mkt_OneYearReturn ? row.mkt_OneYearReturn : "-"}</td>
					<td>${row.mkt_ThreeYearReturn ? row.mkt_ThreeYearReturn : "-"}</td>
					<td>${row.mkt_FiveYearReturn ? row.mkt_FiveYearReturn : "-"}</td>
					<td>${row.mkt_TenYearReturn ? row.mkt_TenYearReturn : "-"}</td>
                    <td>${row.mkt_InceptionReturn ? row.mkt_InceptionReturn : "-"}<br>${row.InceptionDate ? formatDate(row.InceptionDate) : "-"}</td>
					<td>${"-"}</td>
                    <td>${"-"}</td>
                    <td>${"-"}</td>
                </tr>`;
            tableRowsContainer.insertAdjacentHTML('beforeend', tableRow);
			
			if(showBenchMarks) {
				const mprBenchmark = getMPRBenchmark(row.TAFundID);
				if(mprBenchmark && mprBenchmark.BenchmarkType === "P1") {
					
					const benchmarkPerformanceMonthly = (returnsValue === "monthly") ? getBenchmarkPerformanceMonthly(mprBenchmark.FundBenchmarkID) : BenchmarkPerformanceQuarterly(mprBenchmark.FundBenchmarkID);
					const tableRow = `
					<tr>
						<td colspan="3">${mprBenchmark.BenchmarkLabel}</td>
						<td>${row.CumulativeYtd ? row.CumulativeYtd : "-"}</td>
						<td>${row.CumulativeMonth ? row.CumulativeMonth : "-"}</td>
						<td>${row.CumulativeQuarter ? row.CumulativeQuarter : "-"}</td>
						<td>${row.Average1Year ? row.Average1Year : "-"}</td>
						<td>${row.Average3Year ? row.Average3Year : "-"}</td>
						<td>${row.Average5Year ? row.Average5Year : "-"}</td>
						<td>${row.Average10Year ? row.Average10Year : "-"}</td>
						<td>${row.sinceIncep ? row.sinceIncep : "-"}</td>
						<td>${"-"}</td>
						<td>${"-"}</td>
						<td>${"-"}</td>
						<td>${"-"}</td>
					</tr>`;
					tableRowsContainer.insertAdjacentHTML('beforeend', tableRow);
				}
			}
			
			if(showLipper) {
				const mprBenchmark = getMPRBenchmark(row.TAFundID);
				if(mprBenchmark && mprBenchmark.BenchmarkType === "L1") {
					
					const benchmarkPerformanceMonthly = (returnsValue === "monthly") ? getBenchmarkPerformanceMonthly(mprBenchmark.FundBenchmarkID) : BenchmarkPerformanceQuarterly(mprBenchmark.FundBenchmarkID);
					const tableRow = `
					<tr>
						<td colspan="3">${mprBenchmark.BenchmarkLabel}</td>
						<td>${row.CumulativeYtd ? row.CumulativeYtd : "-"}</td>
						<td>${row.CumulativeMonth ? row.CumulativeMonth : "-"}</td>
						<td>${row.CumulativeQuarter ? row.CumulativeQuarter : "-"}</td>
						<td>${row.Average1Year ? row.Average1Year : "-"}</td>
						<td>${row.Average3Year ? row.Average3Year : "-"}</td>
						<td>${row.Average5Year ? row.Average5Year : "-"}</td>
						<td>${row.Average10Year ? row.Average10Year : "-"}</td>
						<td>${row.sinceIncep ? row.sinceIncep : "-"}</td>
						<td>${"-"}</td>
						<td>${"-"}</td>
						<td>${"-"}</td>
						<td>${"-"}</td>
					</tr>`;
					tableRowsContainer.insertAdjacentHTML('beforeend', tableRow);
				}
			}
        });
    }


    // Function to filter and populate data based on selection
    function filterData() {
        tableRowsContainer.innerHTML = ""; // Clear existing rows

        const returnsValue = document.querySelector('input[name="performance_radio"]:checked').value;
		const showBenchMarks = document.getElementById("showBenchMarks").checked;
		const showLipper = document.getElementById("showLipper").checked;

        // Populate table with Data based on the data type
        if (returnsValue === "monthly") {
			// Sort FundPerformanceMonthly by Ticker before processing
			const sortedMonthlyFunds = data.funddata.FundPerformanceMonthly.sort((a, b) => a.Ticker.localeCompare(b.Ticker));
            populateStandardData(sortedMonthlyFunds, showBenchMarks, showLipper, returnsValue) ;
        } else if (returnsValue === "quarterly") {
			// Sort FundPerformanceQuarterly by Ticker before processing
			const sortedQuarterlyFunds = data.funddata.FundPerformanceQuarterly.sort((a, b) => a.Ticker.localeCompare(b.Ticker));
            populateStandardData(sortedQuarterlyFunds, showBenchMarks, showLipper, returnsValue) ;
        }
    }
	
	// Add event listeners to radio buttons
    document.querySelectorAll('input[name="performance_radio"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
           filterData();
        });
    });
	
	// Attach event listeners to checkboxes
	document.getElementById("showBenchMarks").addEventListener("change", filterData);
	document.getElementById("showLipper").addEventListener("change", filterData);

    // Initial population of the table
    filterData();

});
