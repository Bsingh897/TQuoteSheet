const planPrices = {
    "Go5GPlus": [90, 150, 150, 185, 220, 255, 290, 325, 360, 400],
    "Go5G": [75, 130, 130, 155, 180, 205, 230, 255, 280, 310],
    "Essentials": [60, 90, 90, 105, 120, 135, 150, 145, 140, 135],
    "Go5GNextMilitary": [85, 130, 165, 200, 235, 270, 315, 360, 405, 450],
    "Go5GPlusMilitary": [75, 110, 135, 160, 185, 210, 245, 280, 315, 350],
    "Go5GMilitary": [60, 90, 105, 120, 135, 150, 175, 200, 225, 250]
};

const p360Cost = 19; // Cost per line for P360 insurance

let selectedPhones = {}; // To store selected phone options
let selectedTradeInPhones = {}; // To store selected trade-in phones
let selectedTradeInTypes = {}; // To store selected trade-in types

// Function to update the total cost
function updateTotal() {
    const numLines = parseInt(document.getElementById('numLines').value);
    const planType = document.getElementById('planType').value;
    const p360Lines = parseInt(document.getElementById('p360Lines').value);
    const portCreditLines = parseInt(document.getElementById('portCreditLines').value);
    const newLineCreditLines = parseInt(document.getElementById('newLineCreditLines').value);

    let planCost = 0;
    let p360TotalCost = 0;
    let portCreditTotal = 0;
    let newLineCreditTotal = 0;

    if (!isNaN(numLines) && planType) {
        planCost = planPrices[planType][numLines - 1]; // Get the price for the selected plan and number of lines
    }

    if (!isNaN(p360Lines)) {
        p360TotalCost = p360Lines * p360Cost;
    }

    if (!isNaN(portCreditLines)) {
        portCreditTotal = portCreditLines * 250;
    }

    if (!isNaN(newLineCreditLines)) {
        newLineCreditTotal = newLineCreditLines * 150;
    }

    // Update phone options based on number of lines
    updatePhoneOptions(numLines);

    // Update the total cost
    updatePhoneCost();

    // Update trade-in options based on number of lines
    updateTradeInOptions(numLines);

    // Update summary section
    document.getElementById('summaryLines').textContent = numLines || 0;
    document.getElementById('summaryPlanCost').textContent = planCost.toFixed(2);
    document.getElementById('summaryP360Cost').textContent = p360TotalCost.toFixed(2);

    // Update total section
    document.getElementById('tallyPlanCost').textContent = planCost.toFixed(2);
    document.getElementById('tallyP360Cost').textContent = p360TotalCost.toFixed(2);

    // Update promotional summary for gift cards
    const totalGiftCardAmount = portCreditTotal + newLineCreditTotal;
    if (totalGiftCardAmount > 0) {
        document.getElementById('giftCardSummary').textContent = `You qualify for $${totalGiftCardAmount} worth of Costco gift cards.`;
    } else {
        document.getElementById('giftCardSummary').textContent = '';
    }

    updateTotalSummary();
}

// Function to update phone options based on number of lines
function updatePhoneOptions(numLines) {
    const phonesSection = document.getElementById('phonesSection');
    phonesSection.innerHTML = '<h2 class="bold">Pick a Phone</h2>'; // Reset phone options

    for (let i = 1; i <= numLines; i++) {
        const phoneSelect = document.createElement('select');
        phoneSelect.id = `phoneLine${i}`;
        phoneSelect.innerHTML = `
            <option value="">Select phone for line ${i}</option>
            ${Object.keys(phoneCosts).map(phone => `
                <option value="${phone}" ${selectedPhones[`phoneLine${i}`] === phone ? 'selected' : ''}>${phone} - $${phoneCosts[phone].monthlyCost}/month, Full Price: $${phoneCosts[phone].fullPrice}, Down Payment: $${phoneCosts[phone].downPayment}</option>
            `).join('')}
        `;
        phoneSelect.addEventListener('change', function() {
            selectedPhones[`phoneLine${i}`] = phoneSelect.value;
            updatePhoneCost();
        });
        phonesSection.appendChild(phoneSelect);
    }

    // Add summary section at the bottom
    const phoneSummary = document.createElement('div');
    phoneSummary.className = 'section';
    phoneSummary.innerHTML = `
        <p id="phoneSummary">Total Monthly Cost: $<span id="totalMonthlyPhoneCost">0.00</span> | Total Full Price: $<span id="totalFullPhoneCost">0.00</span> | Total Down Payment: $<span id="totalDownPaymentPhoneCost">0.00</span></p>
    `;
    phonesSection.appendChild(phoneSummary);
}

// Function to update phone cost
function updatePhoneCost() {
    const numLines = parseInt(document.getElementById('numLines').value);
    let totalPhoneCost = 0;
    let totalOutTheDoorCost = 0;
    let totalFullPrice = 0;
    let totalDownPayment = 0;

    for (let i = 1; i <= numLines; i++) {
        const phoneSelect = document.getElementById(`phoneLine${i}`);
        if (phoneSelect && phoneSelect.value) {
            const selectedPhone = phoneSelect.value;
            const phoneData = phoneCosts[selectedPhone];
            const phoneTax = 0.1 * parseFloat(phoneData.fullPrice); // 10% tax on the full price
            totalPhoneCost += parseFloat(phoneData.monthlyCost);
            totalFullPrice += parseFloat(phoneData.fullPrice);
            totalDownPayment += parseFloat(phoneData.downPayment) + phoneTax;
            totalOutTheDoorCost += parseFloat(phoneData.downPayment) + phoneTax;
        }
    }

    document.getElementById('tallyPhoneCost').textContent = totalPhoneCost.toFixed(2);
    document.getElementById('tallyOutTheDoorCost').textContent = totalOutTheDoorCost.toFixed(2);

    // Update phone summary
    document.getElementById('totalMonthlyPhoneCost').textContent = totalPhoneCost.toFixed(2);
    document.getElementById('totalFullPhoneCost').textContent = totalFullPrice.toFixed(2);
    document.getElementById('totalDownPaymentPhoneCost').textContent = totalDownPayment.toFixed(2);

    updateTotalSummary();
}

// Function to update trade-in options based on number of lines
function updateTradeInOptions(numLines) {
    const tradeInSection = document.getElementById('promotionsSection');
    tradeInSection.innerHTML = '<h2 class="bold">Trade-In</h2>'; // Reset trade-in options

    for (let i = 1; i <= numLines; i++) {
        const lineContainer = document.createElement('div');
        lineContainer.className = 'line-container';

        const lineHeader = document.createElement('h3');
        lineHeader.textContent = `Line ${i}`;
        lineContainer.appendChild(lineHeader);

        const tradeInSelect = document.createElement('select');
        tradeInSelect.id = `tradeInLine${i}`;
        tradeInSelect.innerHTML = `
            <option value="">Select trade-in type for line ${i}</option>
            <option value="Samsung Trade-in" ${selectedTradeInTypes[`tradeInLine${i}`] === 'Samsung Trade-in' ? 'selected' : ''}>Samsung Trade-in</option>
            <option value="iPhone Trade-in" ${selectedTradeInTypes[`tradeInLine${i}`] === 'iPhone Trade-in' ? 'selected' : ''}>iPhone Trade-in</option>
        `;
        tradeInSelect.addEventListener('change', function() {
            selectedTradeInTypes[`tradeInLine${i}`] = tradeInSelect.value;
            updateTradeInPhones(i, tradeInSelect.value);
        });
        lineContainer.appendChild(tradeInSelect);

        tradeInSection.appendChild(lineContainer);
    }

    // Add summary section at the bottom
    const tradeInSummary = document.createElement('div');
    tradeInSummary.className = 'section';
    tradeInSummary.innerHTML = `
        <p>Total Cost of Credit: $<span id="totalCostOfCredit">0.00</span> | Monthly Cost of Credit: $<span id="monthlyCostOfCredit">0.00</span></p>
    `;
    tradeInSection.appendChild(tradeInSummary);

    // Reapply saved trade-in phones
    Object.keys(selectedTradeInPhones).forEach(line => {
        const [lineNumber, phone] = line.split('-');
        const tradeInPhoneSelect = document.getElementById(`tradeInPhoneLine${lineNumber}`);
        if (tradeInPhoneSelect) {
            tradeInPhoneSelect.value = selectedTradeInPhones[line];
        }
    });
}

// Function to update trade-in phones based on selected trade-in type
function updateTradeInPhones(lineNumber, tradeInType) {
    const tradeInSelect = document.getElementById(`tradeInLine${lineNumber}`);
    const phoneSelect = document.createElement('select');
    phoneSelect.id = `tradeInPhoneLine${lineNumber}`;

    const promoDetails = tradeInType === 'Samsung Trade-in' ? samsungTradeInPhones : iphoneTradeInPhones;

    phoneSelect.innerHTML = `
        <option value="">Select phone for trade-in</option>
        ${Object.entries(promoDetails).map(([value, phones]) =>
            phones.map(phone => `
                <option value="${value}" ${selectedTradeInPhones[`tradeInPhoneLine${lineNumber}`] === phone ? 'selected' : ''}>${phone} - $${value}</option>
            `).join('')
        ).join('')}
    `;

    phoneSelect.addEventListener('change', function() {
        selectedTradeInPhones[`tradeInPhoneLine${lineNumber}`] = phoneSelect.value;
        updateTradeInValue();
        updatePromotionSummary(lineNumber, phoneSelect.options[phoneSelect.selectedIndex].text, tradeInType);
    });

    // Remove previous phone select if exists
    const previousPhoneSelect = document.getElementById(`tradeInPhoneLine${lineNumber}`);
    if (previousPhoneSelect) {
        tradeInSelect.parentNode.removeChild(previousPhoneSelect);
    }

    tradeInSelect.parentNode.insertBefore(phoneSelect, tradeInSelect.nextSibling);
}

// Function to update trade-in value
function updateTradeInValue() {
    const numLines = parseInt(document.getElementById('numLines').value);
    let totalTradeInDiscounts = 0;
    let totalCostOfCredit = 0;
    let monthlyCostOfCredit = 0;

    for (let i = 1; i <= numLines; i++) {
        const tradeInPhoneSelect = document.getElementById(`tradeInPhoneLine${i}`);
        if (tradeInPhoneSelect && tradeInPhoneSelect.value) {
            const selectedValue = parseFloat(tradeInPhoneSelect.value);
            if (!isNaN(selectedValue)) {
                totalTradeInDiscounts += selectedValue;

                // Assume the credit is spread over 24 months
                monthlyCostOfCredit += selectedValue / 24;
                totalCostOfCredit += selectedValue;
            }
        }
    }

    document.getElementById('tallyPhoneCredit').textContent = monthlyCostOfCredit.toFixed(2);
    document.getElementById('totalCostOfCredit').textContent = totalCostOfCredit.toFixed(2);
    document.getElementById('monthlyCostOfCredit').textContent = monthlyCostOfCredit.toFixed(2);

    updateTotalSummary();
}

// Function to update promotion summary
function updatePromotionSummary(lineNumber, phoneText, tradeInType) {
    const promotionSummarySection = document.getElementById('promotionSummaries');
    const [phoneName, totalCreditString] = phoneText.split(' - $');
    const totalCredit = parseFloat(totalCreditString);
    const monthlyCredit = (totalCredit / 24).toFixed(2);

    const lineSummary = document.createElement('p');
    lineSummary.textContent = `Line ${lineNumber}: $${totalCredit} Total amount and $${monthlyCredit} monthly credit for Trading in ${phoneName} (${tradeInType})`;

    // Remove existing summary for this line if exists
    const existingSummary = document.querySelector(`#promotionSummaries p[data-line="${lineNumber}"]`);
    if (existingSummary) {
        promotionSummarySection.removeChild(existingSummary);
    }

    // Add data attribute to identify this line's summary
    lineSummary.setAttribute('data-line', lineNumber);

    promotionSummarySection.appendChild(lineSummary);

    updateTotalSummary();
}

// Function to update the total summary
function updateTotalSummary() {
    const planCost = parseFloat(document.getElementById('tallyPlanCost').textContent);
    const p360Cost = parseFloat(document.getElementById('tallyP360Cost').textContent);
    const phoneCost = parseFloat(document.getElementById('tallyPhoneCost').textContent);
    const phoneCredit = parseFloat(document.getElementById('tallyPhoneCredit').textContent);
    const totalMonthlyCost = planCost + p360Cost + phoneCost - phoneCredit;
    document.getElementById('tallyTotalCost').textContent = totalMonthlyCost.toFixed(2);
}

// Event listeners for updating the total cost
document.getElementById('numLines').addEventListener('change', updateTotal);
document.getElementById('planType').addEventListener('change', updateTotal);
document.getElementById('p360Lines').addEventListener('change', updateTotal);
document.getElementById('portCreditLines').addEventListener('change', updateTotal);
document.getElementById('newLineCreditLines').addEventListener('change', updateTotal);

































    
