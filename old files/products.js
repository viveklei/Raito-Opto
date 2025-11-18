// Product Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const productItems = document.querySelectorAll('.product-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const category = btn.getAttribute('data-category');
        
        productItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.6s ease';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Comparison functionality
let comparisonList = [];
const comparisonBar = document.getElementById('comparisonBar');
const comparisonItems = document.getElementById('comparisonItems');

function addToCompare(button) {
    const productItem = button.closest('.product-item');
    const productName = productItem.querySelector('h3').textContent;
    
    if (button.classList.contains('active')) {
        // Remove from comparison
        button.classList.remove('active');
        comparisonList = comparisonList.filter(item => item !== productName);
    } else {
        // Add to comparison (max 4 items)
        if (comparisonList.length < 4) {
            button.classList.add('active');
            comparisonList.push(productName);
        } else {
            alert('You can compare up to 4 products at a time');
            return;
        }
    }
    
    updateComparisonBar();
}

function updateComparisonBar() {
    const count = comparisonList.length;
    
    if (count > 0) {
        comparisonBar.classList.add('active');
        comparisonItems.innerHTML = `<span class="comparison-count">${count} product${count > 1 ? 's' : ''} selected for comparison</span>`;
    } else {
        comparisonBar.classList.remove('active');
    }
}

function showComparison() {
    if (comparisonList.length < 2) {
        alert('Please select at least 2 products to compare');
        return;
    }
    alert(`Comparing products:\n\n${comparisonList.join('\n')}\n\nIn a full implementation, this would open a detailed comparison view.`);
}

function clearComparison() {
    comparisonList = [];
    document.querySelectorAll('.btn-icon.active').forEach(btn => {
        btn.classList.remove('active');
    });
    updateComparisonBar();
}

// Download brochure
function downloadBrochure(productId) {
    alert(`Downloading brochure for ${productId}...\n\nIn a full implementation, this would download a PDF brochure.`);
}

// Open product modal
function openProductModal(productId) {
    alert(`Opening detailed view for ${productId}...\n\nIn a full implementation, this would open a modal with:\n• High-resolution images\n• Complete specifications\n• Video demonstrations\n• Customer reviews\n• Price information`);
}

// Quote form
function openQuoteForm() {
    alert('Request Quote Form\n\nIn a full implementation, this would open a form to request pricing and additional information.');
}