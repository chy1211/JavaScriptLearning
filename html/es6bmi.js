import {getBMI} from './getBMI.js';
$(document).ready(function () {
    const startPage = `
    身高 : <input type="text" id="height">公尺<br>
    體重 : <input type="text" id="weight">公斤<br>
    BMI = <div id="bmi"></div>
    <button id="cal">計算</button>
    `;
    $("#root").html(startPage);

    $("#cal").click(function (e) { 
    const height = parseFloat($("#height").val());
    const weight = parseInt($("#weight").val());
    $("#bmi").text(getBMI(height,weight));
    });
});
