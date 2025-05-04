/*
   PawsHome Pet Adoption Center
   Pet Care Cost Calculator JavaScript
*/

document.addEventListener('DOMContentLoaded', function() {
    // Get calculator form and result elements
    const calculatorForm = document.getElementById('calculator-form');
    const calculatorResults = document.getElementById('calculator-results');
    const monthlyTotal = document.getElementById('monthly-total');
    const yearlyTotal = document.getElementById('yearly-total');
    const costBreakdown = document.getElementById('cost-breakdown');
    const resetButton = document.getElementById('reset-calculator');
    
    // Base costs for different pet types (monthly)
    const petCosts = {
        dog: {
            small: {
                food: 30,
                grooming: 30,
                toys: 10,
                veterinary: 35,
                insurance: 25
            },
            medium: {
                food: 45,
                grooming: 40,
                toys: 15,
                veterinary: 40,
                insurance: 35
            },
            large: {
                food: 60,
                grooming: 50,
                toys: 20,
                veterinary: 45,
                insurance: 45
            }
        },
        cat: {
            small: {
                food: 20,
                grooming: 15,
                toys: 10,
                veterinary: 25,
                insurance: 15
            },
            medium: {
                food: 30,
                grooming: 20,
                toys: 12,
                veterinary: 30,
                insurance: 20
            },
            large: {
                food: 40,
                grooming: 25,
                toys: 15,
                veterinary: 35,
                insurance: 25
            }
        },
        bird: {
            small: {
                food: 15,
                grooming: 0,
                toys: 10,
                veterinary: 20,
                insurance: 10
            },
            medium: {
                food: 25,
                grooming: 0,
                toys: 15,
                veterinary: 30,
                insurance: 15
            },
            large: {
                food: 40,
                grooming: 0,
                toys: 20,
                veterinary: 40,
                insurance: 20
            }
        },
        rabbit: {
            small: {
                food: 20,
                grooming: 10,
                toys: 8,
                veterinary: 25,
                insurance: 10
            },
            medium: {
                food: 30,
                grooming: 15,
                toys: 10,
                veterinary: 30,
                insurance: 15
            },
            large: {
                food: 40,
                grooming: 20,
                toys: 15,
                veterinary: 35,
                insurance: 20
            }
        },
        fish: {
            small: {
                food: 5,
                grooming: 0,
                toys: 0,
                veterinary: 0,
                insurance: 0
            },
            medium: {
                food: 10,
                grooming: 0,
                toys: 5,
                veterinary: 0,
                insurance: 0
            },
            large: {
                food: 20,
                grooming: 0,
                toys: 10,
                veterinary: 0,
                insurance: 0
            }
        },
        reptile: {
            small: {
                food: 15,
                grooming: 0,
                toys: 5,
                veterinary: 15,
                insurance: 5
            },
            medium: {
                food: 25,
                grooming: 0,
                toys: 10,
                veterinary: 25,
                insurance: 10
            },
            large: {
                food: 40,
                grooming: 0,
                toys: 15,
                veterinary: 35,
                insurance: 15
            }
        }
    };
    
    // Age multipliers
    const ageMultipliers = {
        puppy: 1.2,    // Higher costs for puppies/kittens
        kitten: 1.2,
        young: 1,      // Base cost for young adult animals
        adult: 1,      // Base cost for adult animals
        senior: 1.3    // Higher costs for senior animals
    };
    
    // Special needs multiplier
    const specialNeedsMultiplier = 1.5;
    
    // Handle form submission
    if (calculatorForm) {
        calculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const petType = document.getElementById('pet-type').value;
            const petSize = document.getElementById('pet-size').value;
            const petAge = document.getElementById('pet-age').value;
            const specialNeeds = document.getElementById('special-needs').checked;
            
            // Calculate costs
            calculateCosts(petType, petSize, petAge, specialNeeds);
            
            // Show results
            calculatorResults.classList.remove('hidden');
            
            // Scroll to results
            calculatorResults.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Reset calculator
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            calculatorForm.reset();
            calculatorResults.classList.add('hidden');
        });
    }
    
    // Update available sizes based on pet type
    const petTypeSelect = document.getElementById('pet-type');
    const petSizeSelect = document.getElementById('pet-size');
    
    if (petTypeSelect && petSizeSelect) {
        petTypeSelect.addEventListener('change', function() {
            updateSizeOptions(this.value);
        });
        
        // Initialize size options based on default pet type
        updateSizeOptions(petTypeSelect.value);
    }
    
    function updateSizeOptions(petType) {
        // Clear current options
        petSizeSelect.innerHTML = '';
        
        // Add appropriate size options based on pet type
        if (petType === 'fish' || petType === 'reptile') {
            addSizeOption('small', 'Small (e.g., Betta, Gecko)');
            addSizeOption('medium', 'Medium (e.g., Goldfish, Bearded Dragon)');
            addSizeOption('large', 'Large (e.g., Cichlids, Iguana)');
        } else if (petType === 'bird') {
            addSizeOption('small', 'Small (e.g., Canary, Finch)');
            addSizeOption('medium', 'Medium (e.g., Cockatiel, Conure)');
            addSizeOption('large', 'Large (e.g., Parrot, Macaw)');
        } else if (petType === 'rabbit') {
            addSizeOption('small', 'Small (e.g., Dwarf, Netherland Dwarf)');
            addSizeOption('medium', 'Medium (e.g., Dutch, Rex)');
            addSizeOption('large', 'Large (e.g., Flemish Giant, French Lop)');
        } else if (petType === 'cat') {
            addSizeOption('small', 'Small (7-10 lbs)');
            addSizeOption('medium', 'Medium (10-15 lbs)');
            addSizeOption('large', 'Large (15+ lbs)');
        } else {
            // Dogs and default
            addSizeOption('small', 'Small (0-20 lbs)');
            addSizeOption('medium', 'Medium (21-50 lbs)');
            addSizeOption('large', 'Large (51+ lbs)');
        }
    }
    
    function addSizeOption(value, text) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        petSizeSelect.appendChild(option);
    }
    
    // Calculate pet care costs
    function calculateCosts(petType, petSize, petAge, specialNeeds) {
        // Get base costs for the selected pet type and size
        const baseCosts = petCosts[petType][petSize];
        
        // Apply age multiplier
        const ageMultiplier = ageMultipliers[petAge];
        
        // Calculate costs for each category
        const costs = {};
        let totalMonthlyCost = 0;
        
        for (const category in baseCosts) {
            let categoryCost = baseCosts[category] * ageMultiplier;
            
            // Apply special needs multiplier to veterinary and possibly other costs
            if (specialNeeds && (category === 'veterinary' || category === 'food' || category === 'insurance')) {
                categoryCost *= specialNeedsMultiplier;
            }
            
            costs[category] = categoryCost;
            totalMonthlyCost += categoryCost;
        }
        
        // Calculate yearly cost
        const totalYearlyCost = totalMonthlyCost * 12;
        
        // Update the UI with the calculated costs
        updateCostDisplay(costs, totalMonthlyCost, totalYearlyCost);
    }
    
    // Update the cost display in the UI
    function updateCostDisplay(costs, monthly, yearly) {
        // Update total costs
        if (monthlyTotal) monthlyTotal.textContent = `$${monthly.toFixed(2)}`;
        if (yearlyTotal) yearlyTotal.textContent = `$${yearly.toFixed(2)}`;
        
        // Update cost breakdown
        if (costBreakdown) {
            costBreakdown.innerHTML = '';
            
            for (const category in costs) {
                const cost = costs[category];
                const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                
                const costItem = document.createElement('div');
                costItem.className = 'cost-item';
                costItem.innerHTML = `
                    <span class="cost-category">${categoryName}</span>
                    <span class="cost-value">$${cost.toFixed(2)}/month</span>
                `;
                
                costBreakdown.appendChild(costItem);
            }
        }
        
        // Update chart if it exists
        updateCostChart(costs);
    }
    
    // Update the cost chart
    function updateCostChart(costs) {
        const chartCanvas = document.getElementById('cost-chart');
        
        if (chartCanvas && window.Chart) {
            // Destroy existing chart if it exists
            if (window.costChart) {
                window.costChart.destroy();
            }
            
            // Prepare data for the chart
            const categories = Object.keys(costs).map(category => 
                category.charAt(0).toUpperCase() + category.slice(1)
            );
            const values = Object.values(costs);
            
            // Create a color array
            const colors = [
                '#4a6fa5', // Primary color
                '#ff8c42', // Secondary color
                '#6bbaa7', // Accent color
                '#b6c649',
                '#f45b69',
                '#9c6644'
            ];
            
            // Create the chart
            const ctx = chartCanvas.getContext('2d');
            window.costChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: categories,
                    datasets: [{
                        data: values,
                        backgroundColor: colors,
                        borderColor: 'white',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                font: {
                                    family: 'Roboto, sans-serif',
                                    size: 14
                                },
                                padding: 20
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    return `${label}: $${value.toFixed(2)}`;
                                }
                            }
                        }
                    },
                    animation: {
                        animateRotate: true,
                        animateScale: true
                    }
                }
            });
        }
    }
});
