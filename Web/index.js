//Global variables
var salaryLineChart;
var richPieChart;

//Document is ready
$(document).ready(function(){
    //Make request
    findRichest();

    //Slider
    $(this).on('input change', '#salaryRange', function() {
        var x = $(this).val();
        $("#salaryValue").html(x.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")); 
    });

    //Dyanamic footer
    var docHeight = $(window).height();
    var footerHeight = $('#footer').outerHeight();
    var footerTop = $('#footer').position().top + footerHeight;

    if (footerTop < docHeight) {
        $('#footer').css('margin-top', (docHeight - footerTop) + 'px');
    }

    //Submit button
    $("#submit-btn").click(function() {
        submit();
    });

    //Tabs in index.html
    $("#pills-occupation-tab").click(function(){
        $('#pills-occupation-tab').tab('show');
    });

    $("#pills-rich-tab").click(function(){
        $('#pills-rich-tab').tab('show');
    });
});

//Functions
function submit() {
    if (validateEmail($("#email").val())) {
        $("#submit-btn").html("Calculating...");
        findOccupations();
        findRichest();
    }
}

//Find data
function findOccupations() {
    const salary = $('#salaryRange').val();
    var occupationIndex = [];
    var count = 0;
    
    for(var x = 0; x < occupationData.length; x++) {
        if (count == 3) {
            break;
        }

        var occupationSalary = parseFloat(occupationData[x]["annualWage2019"].replace(/,/g, ''))
        
        if (salaryInRange(salary, occupationSalary - 5000, occupationSalary + 5000)) {
            count+=1
            occupationIndex.push(x)
        }
    }

    if (count == 0) {
        for(var x = 0; x < occupationData.length; x++) {
            if (count == 3) {
                break;
            }
    
            var occupationSalary = parseFloat(occupationData[x]["annualWage2019"].replace(/,/g, ''))
            
            if (salaryInRange(salary, occupationSalary - 10000, occupationSalary + 10000)) {
                count+=1
                occupationIndex.push(x)
            }
        }
    }

    updateOccupation(occupationIndex, salaryLineChart);
}

function findRichest() {
    $.get('https://forbes400.herokuapp.com/api/forbes400?limit=3', function(data){
        updateRichest(data);
        updateRichChart(data, richPieChart);
    });
}

//Update charts
function updateOccupationChart(data, chart) {
    console.log(data)
    var dataset = [];
    var colors = [
        "#00CF98",
        "red",
        "#1890ff",
        "#faad14",
    ];

    for(var x = 0; x< data.length; x++) {
        var set = [];

        for(var z = 0; z < 10; z++) {
            set.push[parseFloat(occupationData[z]["annualWage2019"].replace(/,/g, '')) * (x+1)];
        }

        dataset.push({
            data:set,
            label: occupationData[x].split("*")[0],
            borderColor: colors[x],
            fill: false
        });
    }

    var mySet = [];

    for(x = 0; z < 10; z++) {
        mySet.push(52000 * (x+1))
    }

    dataset.push({
        data:mySet,
        label: "Median household income",
        borderColor: colors[data.length],
        fill: false
    });

    console.log(dataset)

    chart.data = {
        labels: [2020,2021,2022,2023,2024,2025,2026,2027,2028,2029, 2030],
        datasets: dataset
    }

    // data: {
    //     labels: [2020,2021,2022,2023,2024,2025,2026,2027,2028,2029, 2030],
    //     datasets: [{ 
    //         data: one,
    //         label: "Anesthesiologist",
    //         borderColor: "#00CF98",
    //         fill: false
    //     }, { 
    //         data: two,
    //         label: "Median household income",
    //         borderColor: "#faad14",
    //         fill: false
    //         }, 
    //     ]
    // }

    chart.update();
}

function updateRichChart(data, chart) {
    var datasets = [];
    var labels = [];
    
    if (data) {
        for(var x = 0; x < data.length; x++) {
            const billionaire = data[x];
            const finalWorth = (billionaire["finalWorth"] * 1000000);

            datasets.push(finalWorth);
            labels.push(billionaire["personName"]);

        }
        
    } else {
        datasets = [
            186718124000,
            153513808000,
            147708065000,
        ];
        
        labels = [
            'Jeff Bezos',
            'Elon Musk',
            'Bernard Arnault & family',
        ];
    }

    datasets.push($("#salaryRange").val() * 15000);
    labels.push('Your net worth in 15,000 years');

    chart.data = {
        datasets: [{
            data: datasets,
            backgroundColor: [
                "#00CF98",
                "red",
                "#1890ff",
                "#faad14",
            ],
        
        }],
        labels:labels
    };

    chart.update();
}

//Update UI functions
function updateOccupation(indexArray) {
    $("#pills-occupation").html("");

    for(var x = 0; x < indexArray.length; x++) {
        var employmentComparison = occupationData[indexArray[x]]["employment2029"] - occupationData[indexArray[x]]["employment2019"];
        var employmentStyleId = "information-format-description";
        var employmentIndicator = "+"

        if(employmentComparison <= 0) {
            employmentStyleId = "information-format-description-negative";
            employmentIndicator = ""
        }

        var occupationName = occupationData[indexArray[x]]["occupationTitle"].split("*")[0]

        $("#pills-occupation").append(`
        <div id="flex-container">
            <h1>${x + 1}.</h1>
            <div id="one-occupation-description">
                <a href="https://www.onetonline.org/link/summary/${occupationData[indexArray[x]]["occupationCode"]}.00" title="Learn more" target="_blank"><h1>${occupationName}</h1></a>
                <div id="information-format">
                    <h5>Salary: </h5>
                    <h5 id="information-format-description">$${occupationData[indexArray[x]]["annualWage2019"]}</h5>
                </div>
                <div id="information-format">
                    <h5>Degree type: </h5>
                    <h5 id="information-format-description">${occupationData[indexArray[x]]["degreeType"]}</h5>
                </div>
                <div id="information-format">
                    <h5>Projected job openings in 2019: </h5>
                    <h5 id="information-format-description">${(occupationData[indexArray[x]]["employment2019"] * 1000).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h5>
                </div>
                <div id="information-format">
                    <h5>Projected job openings in 2029: </h5>
                    <h5 id="information-format-description">${(occupationData[indexArray[x]]["employment2029"] * 1000).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h5>
                </div>
                <div id="information-format">
                    <h5>Job market based on openings: </h5>
                    <h5 id="${employmentStyleId}">${employmentIndicator}${(Math.ceil(employmentComparison * 1000)).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h5>
                </div>
            </div>
        </div>`);
    }
}

function updateRichest(data) {
    $("#pills-rich").html("");
    for(var x = 0; x < 3; x++) {
        const billionaire = data[x];
        const finalWorth = (billionaire["finalWorth"] * 1000000);
        const salary = $('#salaryRange').val();

        $("#pills-rich").append(`
        <div id="flex-container">
            <h1>${x+1}.</h1>
            <div id="one-occupation-description">
                <h1>${billionaire["personName"]}</h1>
                <div id="information-format">
                    <h5>Source: </h5>
                    <h5 id="information-format-description">${billionaire["source"]}</h5>
                </div>
                <div id="information-format">
                    <h5>Net worth: </h5>
                    <h5 id="information-format-description">$${finalWorth.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h5>
                </div>
                <div id="information-format">
                    <h5>Industry: </h5>
                    <h5 id="information-format-description">${billionaire["industries"][0]}</h5>
                </div>
                <div id="information-format">
                    <h5>How long to reach net worth: </h5>
                    <h5 id="information-format-description">${Math.ceil(finalWorth / salary).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")} years</h5>
                </div>
            </div>
        </div>`);
    }
}

//Helper functions
function resetForm() {
    $("#email").val("");
    $("#salaryRange").val(210000)
    $("#salaryValue").html("210,000")
    $("#submit-btn").html("Calculate");
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function salaryInRange(x, min, max) {
    return x >= min && x <= max;
}

//Onload charts
window.onload = function() {
    var one = [208000]
    var two = [52000]

    for (var x = 1; x <= 10; x++) {
        one.push(one[0] * (x+1))
        two.push(two[0] * (x+1))
    }
    salaryLineChart = new Chart(document.getElementById('occupationChart'), {
        type: 'line',
        data: {
            labels: [2020,2021,2022,2023,2024,2025,2026,2027,2028,2029, 2030],
            datasets: [{ 
                data: one,
                label: "Anesthesiologist",
                borderColor: "#00CF98",
                fill: false
            }, { 
                data: two,
                label: "Median household income",
                borderColor: "#faad14",
                fill: false
                }, 
            ]
        },
        options: {
            title: {
            display: true,
            text: 'Net worth in 10 years (taxes not included)',
            fontColor: "black",
            fontSize: 18,
            fontFamily: "'Roboto', sans-serif",
            },
            legend: {
            labels: {
                fontColor: "black",
                fontFamily: "'Roboto', sans-serif"
            }
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                var tooltipValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                return "$" + parseInt(tooltipValue).toLocaleString();
                }
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    fontFamily: "'Roboto', sans-serif",
                    fontColor: "black",
                    beginAtZero: true,
                    userCallback: function(value, index, values) {
                        value = value.toString();
                        value = value.split(/(?=(?:...)*$)/);
                        value = value.join(',');
                        return "$"+value;
                    }
                }
            }],
            xAxes: [{
                ticks: {
                    fontFamily: "'Roboto', sans-serif",
                    fontColor: "black",
                    beginAtZero: true,
                }
            }]
        }
        }
    });

    richPieChart = new Chart(document.getElementById('richChart'), {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [
                    186718124000,
                    153513808000,
                    147708065000,
                    $("#salaryRange").val() * 15000
                ],
                backgroundColor: [
                    "#00CF98",
                    "red",
                    "#1890ff",
                    "#faad14",
                ],
            
            }],
            labels: [
                'Jeff Bezos',
                'Elon Musk',
                'Bernard Arnault & family',
                'Your net worth in 15,000 years'
            ]
        },
        options: {
            responsive: true,
            legend: {
                labels: {
                    fontColor: "black",
                    fontFamily: "'Roboto', sans-serif"
                }
            },
            title: {
                display: true,
                text: 'Richest people alive',
                fontColor: "black",
                fontSize: 18,
                fontFamily: "'Roboto', sans-serif",
            },
            animation: {
                animateScale: true,
                animateRotate: true
            },
            tooltips: {
                callbacks: {
                  label: function (tooltipItem, data) {
                    var tooltipValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    return "$" + parseInt(tooltipValue).toLocaleString();
                  }
                }
            },
        }
    });

} 