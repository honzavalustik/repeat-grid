// TODO: Push to GitHub
// TODO: Domain and deployment
// TODO: Test live version

// TODO: Mac app when you create txt and then just drag and drop the file directly into AdobeXD
// TODO: Drag and Drop of tags in box to easily change order

import "./general_assets.js";
import data from "./data.js";
import "./bundle.css";


// Elements
let download = document.querySelector(".download");
let downloadAllLinks = [...document.querySelectorAll(".download a")];
let box = document.querySelector(".box");
let boxTags = document.querySelector(".box__tags");
let boxPreview = document.querySelector(".box__preview");
let boxBtnDelete = document.querySelector(".box__btn-delete");
let boxBtnDownload = document.querySelector(".box__btn-download");
let allBtnDeleteTag = [...document.querySelectorAll(".box__btn-delete-tag")];
let fields = document.querySelector(".fields");
let fieldsBtnMore = document.querySelector(".fields__btn-more");
let fieldsAll = document.querySelector(".fields__all");
let allField = [...document.querySelectorAll(".fields__field")];
let recipe = [];


// Functions
const fieldsToggle = () => fields.classList.toggle("fields--hideAll");
const fieldsToggleMore = () => fields.classList.toggle("fields--showMore");

const downloadClickedOnLink = (e) => {
  // Generate data
  recipe = [];
  let cat = e.target.getAttribute("data-cat").split(",");
  let field = e.target.getAttribute("data-field").split(",");
  let name = "";
  
  for(let i=0; i < cat.length; i++){
     recipe.push({cat: cat[i], field: field[i] });
     name += `${field[i] === "space" ? " " : field[i]}`;
  }
  e.target.setAttribute("download", name);
  e.target.href = generateOutputData();

  // Run clicked animation
  e.target.classList.add("download__item--clicked");
  setTimeout(() => e.target.classList.remove("download__item--clicked"), 700);
}

const removeTag = (id) => {
  if(id === null) return;
  boxTags.removeChild(document.querySelector(`.box__btn-delete-tag[data-id="${id}"]`).parentNode);
  updateBox();
}

const addTag = (name, cat, field) => {
  // add space before every tag except when it's the first tag or if there already is a space
  if(field != "space" && boxTags.childNodes.length > 0 && boxTags.childNodes[boxTags.childNodes.length-1].getAttribute("data-field") != "space"){
    boxTags.appendChild(
      createEl({
        type: "div",
        attributes: [
          ["data-cat", "text"],
          ["data-field", "space"],
          ["class", "box__tag"]],
        innerHTML: `&harr; <span class="box__btn-delete-tag" data-id="${boxTags.childNodes.length}" title="${boxTags.childNodes.length}">&#10005;</span>`
      }));
  }

  if(field === "your_text"){
    boxTags.appendChild(
    createEl({
      type: "div",
      attributes: [
        ["data-cat", "text"],
        ["data-field", "your_text"],
        ["class", "box__tag"]],
      innerHTML: `<input type="text" value="" placeholder="Your text..." /><span class="box__btn-delete-tag" data-id="${boxTags.childNodes.length}" title="${boxTags.childNodes.length}">&#10005;</span>`
    }));
  }
  else{
    boxTags.appendChild(
      createEl({
        type: "div",
        attributes: [
          ["data-cat", cat],
          ["data-field", field],
          ["class", "box__tag"]],
        innerHTML: `${name} <span class="box__btn-delete-tag" data-id="${boxTags.childNodes.length}" title="${boxTags.childNodes.length}">&#10005;</span>`
      }));
  }

  updateBox();
}

const updateBox = () => {
  // Clear recipe
  recipe = [];
  
  // Generate preview
  let tags = [...document.querySelectorAll(".box__tags .box__tag")];
  let inputs = [...document.querySelectorAll(".box__tags .box__tag input")];
  let output = "";

  tags.forEach(tag => {
    const cat = tag.getAttribute("data-cat");
    const field = tag.getAttribute("data-field");

    if(field === "your_text"){
      output += tag.childNodes[0].value.replace(/(<([^>]+)>)/ig,"");
      recipe.push({cat: cat, field: field, content: tag.childNodes[0].value.replace(/(<([^>]+)>)/ig,"")});
    }
    else{
      output += data[0][cat][field];
      recipe.push({cat: cat, field: field});
    }
  });

  // Populate preview 
  boxPreview.innerHTML = output;

  // Update state ot he box, if there are tags, show edit state
  if(tags.length <= 0) box.className="box";
  if(tags.length > 0) box.classList.add("box--edit");

  // If there are inputs in tags, add event listeners and run update on any change in these inputs
  inputs.forEach(i => i.addEventListener("keyup", updateBox));
}

const generateOutputData = () => {
  let textFile = null;  
  let text = "";
  let nameOfFile = "";

  // Populate data from data.js based on recipe variable
  data.forEach(d => {
    recipe.forEach(r => {
      if(r.field === "your_text"){
        text += r.content;
      }
      else{
        text += d[r.cat][r.field];
      }
    })
    text += "\n";
  })
  
  let dataBlob = new Blob([text], {type: 'text/plain'});

  // Delete previous file in memory
  window.URL.revokeObjectURL(textFile);

  // Create TXT
  textFile = window.URL.createObjectURL(dataBlob);

  // Append file to Download TXT button
  recipe.forEach(r => nameOfFile += `${r.field === "space" ? " " : r.field}`);
  boxBtnDownload.href = textFile;
  boxBtnDownload.setAttribute("download", `${nameOfFile}`);

  return textFile;
}

const clearBox = () => {
  boxTags.innerHTML = "";
  updateBox();
}

const createEl = (props) => {
  let el = document.createElement(props.type);
  props.attributes.forEach(a => el.setAttribute(a[0], a[1]));
  if(props.innerHTML) el.innerHTML = props.innerHTML;
  return el;
}

// Event Listeners
boxBtnDelete.addEventListener("click", clearBox);
boxBtnDownload.addEventListener("click", generateOutputData);
fieldsBtnMore.addEventListener("click", fieldsToggleMore);
boxTags.addEventListener("click", e => removeTag(e.target.getAttribute("data-id")));

downloadAllLinks.forEach(key => key.addEventListener("click", e => {
  downloadClickedOnLink(e)
}));

allField.forEach(key => key.addEventListener("click", () => {
  addTag(key.textContent, key.getAttribute("data-cat"), key.getAttribute("data-field"));
}));