const asyncHandler = require('express-async-handler')
const Contact = require("../models/contactModel")
//@desc Get all contacts
//@route Get /api/contacts
//@access Private
const getContacts  = asyncHandler(async (req,res) =>{
  const contacts = await Contact.find({user_id: req.user.id});
  res.status(200).json(contacts)
});


//@desc Get contacts
//@route Get /api/contacts/:id
//@access Private
const getContact = asyncHandler(async (req,res) =>{
  const contact = await Contact.findById(req.params.id)
  if (!contact) {
    res.status(404);
    throw new Error("contact not found")
  }
  res.status(200).json(contact)
});

//@desc create all contacts
//@route Post /api/contacts
//@access Private
const createContacts = asyncHandler(async (req,res) =>{
  console.log(req.body)
  const{name, email,phone} = req.body
  if (!name||!email||!phone) {
    res.status(400);
    throw new Error("All fields are mandatory")
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id
  });
  res.status(201).json(contact)
});

//@desc Update  contact
//@route Put /api/contacts/:id
//@access Private
const updateContact = asyncHandler(async (req,res) =>{
  const contact = await Contact.findById(req.params.id)
  if (!contact) {
    res.status(404);
    throw new Error("Contact not Found")
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user contacts")
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new: true}

);

  res.status(200).json(updatedContact)
});

//@desc Delete  contact
//@route delete /api/contacts
//@access Private
const deleteContact = asyncHandler(async (req,res) =>{
    const contact = await Contact.findById(req.params.id)
  if (!contact) {
    res.status(404);
    throw new Error("Contact not Found")
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user contacts")
  }

  const deletedContact = await Contact.findByIdAndDelete(
    req.params.id,
    res.status(200).json("contact deleted successfully")
  );
  res.status(200).json(deletedContact)
});

module.exports = {
  getContact,
  getContacts,
  createContacts,
  updateContact,
  deleteContact
}