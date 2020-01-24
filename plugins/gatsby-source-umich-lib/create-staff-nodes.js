const crypto = require('crypto')

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

async function createStaffNodes({ createNode, staffRawData }) {
  staffRawData.forEach(rawMetadata => {
    const metadata = processRawMetadata(rawMetadata)

    const node = {
      // Staff person metadata
      ...metadata,
      // Gatsby Node required fields
      id: `staff-${metadata.uniqname}`,
      parent: null,
      children: [],
      internal: {
        type: 'Staff',
        contentDigest: crypto
          .createHash(`md5`)
          .update(JSON.stringify(metadata))
          .digest(`hex`),
      },
    }

    createNode(node)
  })
}

function processRawMetadata(data) {
  const {
    name,
    field_user_display_name,
    field_user_work_title,
    field_user_email,
    field_user_phone,
    field_user_department,
  } = data

  const processedMetadata = {
    uniqname: name,
    name: field_user_display_name,
    title: field_user_work_title,
    email: field_user_email,
    phone: field_user_phone === '000-000-0000' ? null : field_user_phone,
    department_drupal_nid: field_user_department.split(', ')[1],
  }

  return processedMetadata
}

exports.createStaffNodes = createStaffNodes
