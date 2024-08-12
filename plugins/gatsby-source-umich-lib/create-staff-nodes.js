/* eslint-disable camelcase */
const crypto = require('crypto');
const entities = require('entities');
/*
  1. Fetch the staff API.
    https://cms.lib.umich.edu/api/staff

  2. Create a staff node for each person.

  3. Create node links for:
    - department
    - division

  4. Handle phone numbers.
    - if value is 000-000-0000 then set to null.

  example node:
  {
    uniqname: 'earleyj',
    title: 'User Interface Design Engineer'
    name: 'Jon Earley',
    email: 'earleyj@umich.edu',
    phone: null,
    department: { ... department data }
  }
*/

const processOfficeArray = (rawArray) => {
  const arr = rawArray.filter((filterItemA) => {
    return filterItemA;
  });

  return arr.filter((filterItemB) => {
    return filterItemB && filterItemB.length > 0;
  });
};

const processOffice = (arr) => {
  const processed = processOfficeArray(arr).join(' ');
  return processed.length > 0 ? processed : null;
};

const processRawMetadata = (data) => {
  const {
    name,
    field_user_display_name,
    field_user_work_title,
    field_user_email,
    field_user_phone,
    field_user_department,
    field_media_image,
    field_room_building,
    field_user_room
  } = data;
  const [division_nid, department_nid] = field_user_department.split(', ');
  const office = processOffice([field_user_room, field_room_building]);
  const processedMetadata = {
    department_nid,
    division_nid,
    email: field_user_email,
    image_mid: field_media_image,
    name: entities.decodeHTML(field_user_display_name),
    office,
    phone: field_user_phone === '000-000-0000' ? null : field_user_phone,
    title: field_user_work_title,
    uniqname: name
  };

  return processedMetadata;
};

const createStaffNodes = async ({ createNode, staffRawData }) => {
  await staffRawData.forEach((rawMetadata) => {
    const metadata = processRawMetadata(rawMetadata);

    const node = {
      // Staff person metadata
      ...metadata,
      // Gatsby Node required fields
      children: [],
      id: `staff-${metadata.uniqname}`,
      internal: {
        contentDigest: crypto
          .createHash(`md5`)
          .update(JSON.stringify(metadata))
          .digest(`hex`),
        type: 'Staff'
      },
      parent: null
    };
    createNode(node);
  });
};

exports.createStaffNodes = createStaffNodes;
