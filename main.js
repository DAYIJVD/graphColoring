//Imports
import idsColoring from "./utils/IdsAlgorithm.js";
import { convertMatrixToGraph} from "./utils/readAndConvertMatrix.js";
//variables
const colors = ["#FF0000", "#0000FF", "#00FF00"];
const svgElements = document.getElementsByTagName('svg');  
const outBtn = document.getElementById('outBtn');  
const FileInput=document.getElementById("fileInput");
const modal = document.getElementById("myModal");
const infoBtn = document.getElementById("infoBtn");
const closeSpan = document.querySelector(".close");
const closeButton = document.getElementById("closeButton");
const darkModeButton = document.getElementById("darkMode");
let matrix = [];
const currentDisplay = window.getComputedStyle(outBtn).display;  
const startBtn=document.getElementById("startBtn")

//events
    FileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result.trim();
                matrix = text.split("\n").map(row => row.trim().split(/\s+/).map(Number));
                console.log("Matrix loaded:", matrix);
            };
            reader.readAsText(file);
        }
    });
outBtn.addEventListener("click",()=>{
    if (svgElements.length > 0) {  
        svgElements[0].innerHTML = `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#aaa" font-size="20px">  
            محل رسم گراف  
        </text>`;  
    }
  
    
    if (currentDisplay === "none") {  
        outBtn.style.display = "block";  
    } else {  
        outBtn.style.display = "none";  
    }  
    document.getElementById("fileInput").value='';
    document.getElementById("result").innerHTML =`
          <h3 style="text-align: center; color: #4caf50;">نتایج رنگ‌آمیزی</h3>
            <p>لطفاً ابتدا گراف را رنگ‌آمیزی کنید.</p>
        </div>
    `
})
startBtn.addEventListener("click", () => {  
  const currentDisplay = window.getComputedStyle(outBtn).display;  
  if (matrix.length === 0) {  
    alert("لطفاً یک فایل ماتریس معتبر بارگذاری کنید.");  
    return;  
}else if (currentDisplay === "none") {  
    outBtn.style.display = "block";  
} 
    const graph = convertMatrixToGraph(matrix);   
    const result = idsColoring(graph,3);  
    if (!result) {  
                console.error("Couldn't find a valid coloring.");  
                return;  
            }
console.log(result)
renderGraph(result.colors)
    const {colors,steps} = result;
    renderGraph(colors);
    const vertexColors = colors
        .map((color, index) => `<li>رأس ${index}: رنگ ${color==2&&'آبی'||color==1&&'قرمز'||color==3&&'سبز'}</li>`)
        .join("");
    document.getElementById("result").innerHTML = `
        <h3 style="color: green;">نتایج رنگ‌آمیزی گراف:</h3>
        <p><strong>تعداد رنگ‌ها استفاده‌شده:</strong> ${new Set(colors).size}</p>
        <p><strong>رنگ هر رأس:</strong></p>
        <ul style="line-height: 1.8;">${vertexColors}</ul>
        <p><strong>وضعیت:</strong> رنگ‌آمیزی با موفقیت انجام شد.</p>
    `;
});





function renderGraph(colorIndices) {  
    const svg = d3.select("#graph");  
    const nodes = colorIndices.map((colorIndex, i) => ({ id: i, colorIndex }));  

    // بررسی وجود matrix  
    if (!matrix || matrix.length === 0) {  
        console.error("Matrix is undefined or empty.");  
        return;  
    }  

    const links = [];  
    matrix.forEach((row, i) => {  
        row.forEach((val, j) => {  
            if (val === 1 && i < j) links.push({ source: i, target: j });  
        });  
    });  

    svg.selectAll("*").remove();  // حذف المان‌های قبلی  

    const radius = 150;  
    const centerX = 300;  
    const centerY = 200;  

    // محاسبه موقعیت نودها  
    nodes.forEach((node, i) => {  
        const angle = (2 * Math.PI * i) / nodes.length;  
        node.x = centerX + radius * Math.cos(angle);  
        node.y = centerY + radius * Math.sin(angle);  
    });  

    svg.selectAll(".link")  
        .data(links)  
        .enter()  
        .append("line")  
        .attr("class", "link")  
        .attr("stroke", "#999")  
        .attr("x1", d => nodes[d.source].x)  
        .attr("y1", d => nodes[d.source].y)  
        .attr("x2", d => nodes[d.target].x)  
        .attr("y2", d => nodes[d.target].y);  

    const node = svg.selectAll(".node")  
        .data(nodes)  
        .enter()  
        .append("circle")  
        .attr("class", "node")  
        .attr("r", 20)  
        .attr("fill", d => (d.colorIndex > 0 && d.colorIndex <= colors.length ? colors[d.colorIndex - 1] : "#ccc"))  
        .attr("cx", d => d.x)  
        .attr("cy", d => d.y);  

    svg.selectAll(".node-label")  
        .data(nodes)  
        .enter()  
        .append("text")  
        .attr("class", "node-label")  
        .attr("text-anchor", "middle")  
        .attr("dy", ".35em")  
        .attr("x", d => d.x)  
        .attr("y", d => d.y)  
        .text(d => d.id);  
}

//modal and DarkMode Feture
modal.style.display = "block";

infoBtn.onclick = () => {
    modal.style.display = "block";
};

closeSpan.onclick = () => {
    modal.style.display = "none";
};

closeButton.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

darkModeButton.onclick = () => {
    document.body.classList.toggle("dark-mode");
    modal.querySelector(".modal-content").classList.toggle("dark-mode");
    darkModeButton.innerText = document.body.classList.contains("dark-mode") ? "حالت روز" : "حالت شب";
};

let isDragging = false;
let offsetX, offsetY;

const modalContent = document.querySelector(".modal-content");

modalContent.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - modalContent.getBoundingClientRect().left;
    offsetY = e.clientY - modalContent.getBoundingClientRect().top;
    modalContent.style.cursor = "move";
});

window.addEventListener("mousemove", (e) => {
    if (isDragging) {
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;

        modalContent.style.position = "absolute";
        modalContent.style.left = `${x}px`;
        modalContent.style.top = `${y}px`;
    }
});

window.addEventListener("mouseup", () => {
    isDragging = false;
    modalContent.style.cursor = "default";
});
