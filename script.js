document.addEventListener('DOMContentLoaded', function() {
    const selectedFunds = new Set();
    const fundSelect = document.getElementById('fundSelect');
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    const addFundBtn = document.querySelector('.add-fund');
    const clearAllBtn = document.querySelector('.clear-all');
    const getHistoryBtn = document.querySelector('.get-history');
    const selectedFundsContainer = document.querySelector('.selected-funds');

    // Load the JSON data using XMLHttpRequest to avoid CORS issues
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'reportjson.json', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    console.log('Successfully loaded data');
                    
                    // Clear existing options
                    fundSelect.innerHTML = '<option value="" selected disabled>Browse Funds</option>';
                    
                    // Add funds from the Funds array in the JSON data
                    if (data.Funds && Array.isArray(data.Funds)) {
                        // Sort funds alphabetically by name
                        data.Funds.sort((a, b) => a.FundName.localeCompare(b.FundName));
                        
                        data.Funds.forEach(fund => {
                            const option = document.createElement('option');
                            option.value = fund.FundId;
                            option.textContent = fund.FundName;
                            // If the fund is featured, add a special class
                            if (data.FeaturedFunds && data.FeaturedFunds.includes(Number(fund.FundId))) {
                                option.classList.add('featured-fund');
                            }
                            fundSelect.appendChild(option);
                        });
                        console.log('Added', data.Funds.length, 'funds to select');
                    } else {
                        console.error('No Funds array found in data structure:', data);
                        alert('Error: Invalid data structure in reportjson.json');
                        fundSelect.innerHTML = '<option value="" selected disabled>Error Loading Funds</option>';
                    }
                } catch (e) {
                    console.error('Error parsing JSON:', e);
                    alert('Error: Invalid JSON format in reportjson.json');
                    fundSelect.innerHTML = '<option value="" selected disabled>Error Loading Funds</option>';
                }
            } else {
                console.error('Failed to load JSON file. Status:', xhr.status);
                alert('Error: Could not load reportjson.json file');
                fundSelect.innerHTML = '<option value="" selected disabled>Error Loading Funds</option>';
            }
        }
    };
    xhr.onerror = function(e) {
        console.error('Network error loading JSON file:', e);
        alert('Network error: Could not load reportjson.json file');
        fundSelect.innerHTML = '<option value="" selected disabled>Error Loading Funds</option>';
    };
    xhr.send();

    // Initialize month select with header
    monthSelect.innerHTML = `
        <option value="" disabled selected>Month-End</option>
        <option value="" disabled class="month-end-header">Month-End</option>
        <option value="01" class="month-option">January</option>
        <option value="02" class="month-option">February</option>
        <option value="03" class="month-option">March</option>
        <option value="04" class="month-option">April</option>
        <option value="05" class="month-option">May</option>
        <option value="06" class="month-option">June</option>
        <option value="07" class="month-option">July</option>
        <option value="08" class="month-option">August</option>
        <option value="09" class="month-option">September</option>
        <option value="10" class="month-option">October</option>
        <option value="11" class="month-option">November</option>
        <option value="12" class="month-option">December</option>
    `;

    // Initialize year select options
    const currentYear = new Date().getFullYear();
    yearSelect.innerHTML = '<option value="" disabled selected>Year</option>';
    for (let year = currentYear; year >= currentYear - 10; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // Function to handle dropdown state
    function updateDropdownState(select) {
        const hasValue = select.value !== "";
        select.classList.toggle('has-value', hasValue);
        if (hasValue) {
            select.classList.add('selected');
        }
    }

    // Add event listeners for dropdowns
    [monthSelect, yearSelect].forEach(select => {
        // Handle change events
        select.addEventListener('change', function() {
            updateDropdownState(this);
        });

        // Prevent default behavior when clicking on disabled options
        select.addEventListener('mousedown', function(e) {
            const option = e.target.closest('option');
            if (option && option.disabled) {
                e.preventDefault();
            }
        });

        // Handle focus/blur for styling
        select.addEventListener('focus', function() {
            this.classList.add('focused');
        });

        select.addEventListener('blur', function() {
            this.classList.remove('focused');
        });
    });

    // Add fund functionality
    addFundBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const selectedOption = fundSelect.options[fundSelect.selectedIndex];
        
        if (selectedOption && selectedOption.value && !selectedFunds.has(selectedOption.value)) {
            if (selectedFunds.size >= 5) {
                alert('You can select up to five (5) funds only.');
                return;
            }

            // Store fund ID and name
            const fundId = selectedOption.value.toString();
            const fundName = selectedOption.textContent;
            selectedFunds.add(fundId);
            console.log('Added fund:', fundId, 'Name:', fundName);
            
            const fundTag = document.createElement('div');
            fundTag.className = 'fund-tag';
            fundTag.innerHTML = `
                ${fundName}
                <span class="remove">×</span>
            `;
            
            fundTag.querySelector('.remove').addEventListener('click', function() {
                selectedFunds.delete(fundId);
                fundTag.remove();
                updateAddFundButton();
            });
            
            selectedFundsContainer.appendChild(fundTag);
            updateAddFundButton();
        }
    });

    // Clear all functionality
    clearAllBtn.addEventListener('click', function(e) {
        e.preventDefault();
        selectedFunds.clear();
        selectedFundsContainer.innerHTML = '';
        updateAddFundButton();
    });

    // Get history functionality
    getHistoryBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const selectedMonth = monthSelect.value;
        const selectedYear = yearSelect.value;
        
        if (selectedFunds.size === 0) {
            alert('Please select at least one fund.');
            return;
        }
        
        if (!selectedMonth || !selectedYear) {
            alert('Please select both month and year.');
            return;
        }

        // Show loading state
        getHistoryBtn.disabled = true;
        getHistoryBtn.textContent = 'Loading...';

        // Load historical data
        fetch('historicaldatajson.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Extract performance and expenses data
                let performances = [];
                let expenses = [];

                if (data?.NewDataSet?.Historical?.Performance) {
                    performances = Array.isArray(data.NewDataSet.Historical.Performance)
                        ? data.NewDataSet.Historical.Performance
                        : [data.NewDataSet.Historical.Performance];
                } else {
                    throw new Error('Invalid data structure: Performance data not found');
                }

                if (data?.NewDataSet?.Historical?.FundExpenses) {
                    expenses = Array.isArray(data.NewDataSet.Historical.FundExpenses)
                        ? data.NewDataSet.Historical.FundExpenses
                        : [data.NewDataSet.Historical.FundExpenses];
                } else {
                    throw new Error('Invalid data structure: Fund Expenses data not found');
                }

                // Filter data for selected funds and time period
                const filteredData = performances.map(perf => {
                    const expense = expenses.find(exp => 
                        exp.CUSIP === perf.CUSIP && 
                        exp.MDMFundId === perf.MDMFundId &&
                        exp.MDMShareClassId === perf.MDMShareClassId
                    );

                    if (!expense) return null;

                    const perfDate = new Date(perf.AsOfDate);
                    const perfMonth = (perfDate.getMonth() + 1).toString().padStart(2, '0');
                    const perfYear = perfDate.getFullYear().toString();

                    if (perfMonth === selectedMonth && perfYear === selectedYear) {
                        return {
                            ...perf,
                            GrossOperatingExpenses: expense.GrossOperatingExpenses,
                            NetOperatingExpenses: expense.NetOperatingExpenses,
                            ReductionDate: expense.ReductionDate
                        };
                    }
                    return null;
                }).filter(Boolean);

                if (filteredData.length === 0) {
                    throw new Error('No data found for the selected funds and time period');
                }

                // Generate and display the table
                generateHistoricalTable(filteredData);
            })
            .catch(error => {
                console.error('Error loading historical data:', error);
                alert(error.message || 'Error loading historical data. Please try again.');
            })
            .finally(() => {
                // Reset button state
                getHistoryBtn.disabled = false;
                getHistoryBtn.textContent = 'Get History';
            });
    });

    function getFundName(mdmFundId) {
        const fundMap = {
            '459': 'Balanced',
            '503': 'Core Bond',
            '505': 'California Muni Income'
        };
        return fundMap[mdmFundId] || '-';
    }

    function getShareClass(mdmShareClassId) {
        const shareClassMap = {
            '299': 'A',
            '300': 'C',
            '301': 'Z',
            '302': 'R',
            '584': 'R6'
        };
        return shareClassMap[mdmShareClassId] || '-';
    }

    function getTicker(cusip) {
        const tickerMap = {
            '74437E586': 'PBCAX',  // California Muni Income A
            '74437E578': 'PCICX',  // California Muni Income C
            '74437E875': 'PCIZX',  // California Muni Income Z
            '74440X209': 'PALRX',  // Balanced R
            '74440X308': 'PABFX',  // Balanced Z
            '74440X407': 'TAIBX',  // Core Bond Z
            '74440X506': 'PIBAX',  // Balanced A
            '74440X605': 'PABCX'   // Balanced C
        };
        return tickerMap[cusip] || '-';
    }

    function getInceptionDate(cusip) {
        const inceptionMap = {
            '74437E586': '12/3/90',   // PBCAX
            '74437E578': '8/1/94',    // PCICX
            '74437E875': '9/18/96',   // PCIZX
            '74440X209': '12/17/04',  // PALRX
            '74440X308': '1/4/93',    // PABFX
            '74440X407': '1/5/93',    // TAIBX
            '74440X506': '11/7/96',   // PIBAX
            '74440X605': '11/7/96'    // PABCX
        };
        return inceptionMap[cusip] || '-';
    }

    function formatNumber(num) {
        if (num === undefined || num === null) return '';
        const value = parseFloat(num);
        return value.toFixed(2);
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
    }

    function generateHistoricalTable(historicalData) {
        removeHistoricalTable();
        
        // Add disclaimer text
        const disclaimer = document.createElement('p');
        disclaimer.className = 'disclaimer';
        disclaimer.textContent = 'Past performance does not guarantee future results and current performance may be lower or higher than the past performance data quoted. The investment return and principal value will fluctuate, and shares, when sold, may be worth more or less than the original cost. The current maximum sales charges that may be applied to the funds listed below are Class A, 5.5% and Class C, 1.0%. All returns 1-year or less are cumulative.';

        // Add sales type selector
        const salesTypeContainer = document.createElement('div');
        salesTypeContainer.className = 'sales-type-container';
        salesTypeContainer.innerHTML = `
            <h3>SALES TYPE:</h3>
            <div class="sales-type-buttons">
                <button class="sales-type-button" data-type="with">with</button>
                <button class="sales-type-button active" data-type="without">without</button>
            </div>
        `;

        // Add class buttons
        const classButtonsContainer = document.createElement('div');
        classButtonsContainer.className = 'class-buttons';
        ['A', 'R', 'Z', 'C', 'R6', 'All'].forEach(cls => {
            const button = document.createElement('button');
            button.className = 'class-button';
            button.textContent = cls;
            button.onclick = () => filterByClass(cls);
            classButtonsContainer.appendChild(button);
        });
        
        // Ensure container exists
        let container = document.getElementById('historicalTableContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'historicalTableContainer';
            document.querySelector('.container').appendChild(container);
        }

        // Clear container
        container.innerHTML = '';
        
        // Add elements to container
        container.appendChild(disclaimer);
        container.appendChild(classButtonsContainer);
        container.appendChild(salesTypeContainer);
        
        const table = document.createElement('table');
        table.className = 'historical-table';
        
        // Create table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr class="sub-header">
                <th colspan="4">Average Annual Total Returns as of ${formatDate(historicalData[0].AsOfDate)}</th>
                <th colspan="7" class="returns-header">Total Returns<br>(without sales charges)</th>
                <th colspan="3" class="expense-header">Current Expense<br>Ratio (%) *</th>
            </tr>
            <tr class="column-header">
                <th class="align-left">Fund</th>
                <th class="align-left">Class</th>
                <th class="align-left">Ticker</th>
                <th class="align-left">Inception<br>Date</th>
                <th>Most<br>Recent<br>QSEC<br>Returns</th>
                <th>YTD</th>
                <th>1<br>Year</th>
                <th>3<br>Year</th>
                <th>5<br>Year</th>
                <th>10<br>Year</th>
                <th>Life</th>
                <th>Gross</th>
                <th>Net</th>
                <th>Date *</th>
            </tr>
        `;
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement('tbody');
        historicalData.forEach(data => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="align-left fund-name">${data.FundName}</td>
                <td class="align-left">${data.FundClassName}</td>
                <td class="align-left">${data.Ticker}</td>
                <td class="align-left">${formatDate(data.InceptionDate)}</td>
                <td class="qsec-returns"><a href="#" class="view-link">view</a></td>
                <td>${formatNumber(data.wo_sub_ytd_ret)}</td>
                <td>${formatNumber(data.wo_sc_wo_sub_1yr)}</td>
                <td>${formatNumber(data.wo_sc_wo_sub_3yr)}</td>
                <td>${formatNumber(data.wo_sc_wo_sub_5yr)}</td>
                <td>${formatNumber(data.wo_sc_wo_sub_10yr)}</td>
                <td>${formatNumber(data.wo_sc_wo_sub_incp)}</td>
                <td>${formatNumber(data.GrossOperatingExpenses)}</td>
                <td>${formatNumber(data.NetOperatingExpenses)}</td>
                <td>${formatDate(data.ReductionDate)}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        // Add table to the document
        container.appendChild(table);

        // Add event listeners for sales type buttons
        const salesTypeButtons = container.querySelectorAll('.sales-type-button');
        salesTypeButtons.forEach(button => {
            button.addEventListener('click', function() {
                salesTypeButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                updateTableData(historicalData, this.dataset.type === 'with');
            });
        });
    }

    function updateTableData(historicalData, withSalesCharges) {
        const tbody = document.querySelector('.historical-table tbody');
        if (!tbody) return;

        const rows = tbody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            const data = historicalData[index];
            const cells = row.querySelectorAll('td');
            
            // Update returns data based on sales charges
            if (withSalesCharges) {
                cells[5].textContent = formatNumber(data.wo_sub_ytd_ret); // YTD stays the same
                cells[6].textContent = formatNumber(data.w_sc_wo_sub_1yr);
                cells[7].textContent = formatNumber(data.w_sc_wo_sub_3yr);
                cells[8].textContent = formatNumber(data.w_sc_wo_sub_5yr);
                cells[9].textContent = formatNumber(data.w_sc_wo_sub_10yr);
                cells[10].textContent = formatNumber(data.w_sc_wo_sub_incp);
                // Skip updating cell[4] as it contains the view link
            } else {
                cells[5].textContent = formatNumber(data.wo_sub_ytd_ret);
                cells[6].textContent = formatNumber(data.wo_sc_wo_sub_1yr);
                cells[7].textContent = formatNumber(data.wo_sc_wo_sub_3yr);
                cells[8].textContent = formatNumber(data.wo_sc_wo_sub_5yr);
                cells[9].textContent = formatNumber(data.wo_sc_wo_sub_10yr);
                cells[10].textContent = formatNumber(data.wo_sc_wo_sub_incp);
                // Skip updating cell[4] as it contains the view link
            }
        });

        // Update the returns header text
        const returnsHeader = document.querySelector('.returns-header');
        if (returnsHeader) {
            returnsHeader.innerHTML = `Total Returns<br>(${withSalesCharges ? 'with' : 'without'} sales charges)`;
        }
    }

    function filterByClass(classType) {
        const rows = document.querySelectorAll('.historical-table tbody tr');
        rows.forEach(row => {
            const classCell = row.children[1];
            if (classType === 'All' || classCell.textContent === classType) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    function updateAddFundButton() {
        const maxFundsReached = selectedFunds.size >= 5;
        addFundBtn.style.opacity = maxFundsReached ? '0.5' : '1';
        addFundBtn.style.cursor = maxFundsReached ? 'not-allowed' : 'pointer';
    }

    function removeHistoricalTable() {
        const existingTable = document.querySelector('.historical-table');
        if (existingTable) {
            existingTable.remove();
        }
    }
}); 