/**
 * Keep client-side hours payloads limited to the fields displayHours reads.
 * Drupal location relationships also contain address, floor-plan, and metadata fields.
 */
export default function getHoursClientData(node) {
  if (!node) {
    return null;
  }

  const slimHours = (hours) => {
    if (!Array.isArray(hours)) {
      return hours ?? null;
    }

    return hours.map((set) => ({
      __typename: set.__typename,
      field_date_range: set.field_date_range
        ? {
            value: set.field_date_range.value,
            end_value: set.field_date_range.end_value
          }
        : null,
      field_hours_open: Array.isArray(set.field_hours_open)
        ? set.field_hours_open.map((day) => ({
            day: day.day,
            all_day: day.all_day,
            starthours: day.starthours,
            endhours: day.endhours,
            comment: day.comment
          }))
        : []
    }));
  };

  return {
    field_display_hours_: node.field_display_hours_ ?? false,
    field_hours_different_from_build: node.field_hours_different_from_build ?? false,
    relationships: {
      field_hours_open: slimHours(node.relationships?.field_hours_open),
      field_room_building: node.relationships?.field_room_building
        ? getHoursClientData(node.relationships.field_room_building)
        : null,
      field_parent_location: node.relationships?.field_parent_location
        ? getHoursClientData(node.relationships.field_parent_location)
        : null
    }
  };
}