const Contact = require('./schemas/contact');

const listContacts = async (
  userId,
  { sortBy, sortByDesc, filter, page = '1', limit = '20' },
) => {
  const data = await Contact.paginate(
    { owner: userId },
    {
      page,
      limit,
      sort: {
        ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
        ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
      },
      select: filter ? filter.split('|').join(' ') : '',
      populate: {
        path: 'owner',
        select: 'email subscription -_id',
      },
    },
  );
  const { docs: contacts, totalDocs: total } = data;
  return { total: total.toString(), page, limit, contacts };
};

const getContactById = async (contactId, userId) => {
  const data = await Contact.findOne({
    _id: contactId,
    owner: userId,
  }).populate({
    path: 'owner',
    select: 'email subscription -_id',
  });
  return data;
};

const addContact = async body => {
  const data = await Contact.create(body);
  return data;
};

const updateContact = async (contactId, body, userId) => {
  const data = await Contact.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true },
  );
  return data;
};

const removeContact = async (contactId, userId) => {
  const data = await Contact.findByIdAndRemove({
    _id: contactId,
    owner: userId,
  });
  return data;
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};
