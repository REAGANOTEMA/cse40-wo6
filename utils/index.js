// Author: Reagan Otema
// Utility functions for CSE 340 Assignment 4

const invModel = require("../models/inventorymodel");

/**
 * Build a dynamic classification dropdown list for forms
 * @param {number|null} classification_id - Selected classification for sticky form
 * @returns {string} HTML <select> element with classifications
 */
exports.buildClassificationList = async function (classification_id = null) {
  try {
    const data = await invModel.getClassifications();
    let classificationList = '<select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";

    data.forEach((row) => {
      classificationList += `<option value='${row.classification_id}'`;
      if (classification_id !== null && row.classification_id == classification_id) {
        classificationList += " selected";
      }
      classificationList += `>${row.classification_name}</option>`;
    });

    classificationList += "</select>";
    return classificationList;
  } catch (error) {
    console.error("Error building classification list:", error);
    throw error;
  }
};

/**
 * Build the main navigation menu
 * @returns {string} HTML <ul> navigation
 */
exports.getNav = async function () {
  return `
    <ul>
      <li><a href="/inv/">Inventory Management</a></li>
      <li><a href="/inv/add-classification">Add Classification</a></li>
      <li><a href="/inv/add-inventory">Add Vehicle</a></li>
    </ul>
  `;
};
