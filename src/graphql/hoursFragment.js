import { graphql } from 'gatsby';

export const query = graphql`
  fragment hoursFragment on Node {
    __typename
    ... on paragraph__labor_day_holiday_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__fall_and_winter_semester_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__fall_study_break {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__thanksgiving_break_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__fall_exam_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__winter_break_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__intersession_after_new_year {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__spring_break_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__winter_exam_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__intersession_after_winter_exams {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__memorial_day_holiday_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__spring_term_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
        comment
      }
    }
    ... on paragraph__july_4_holiday_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__summer_term_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__intersession_after_summer_exams {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__hours_exceptions {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__hours_exceptions {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
        comment
      }
    }
  }
`;
