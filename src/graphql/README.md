# Organize project Graphql queries and fragments

Resources

- https://medium.com/flatiron-labs/using-graphql-fragments-across-multiple-templates-in-gatsbyjs-7731a2d28bbd

## Rules

- Each fragment gets its own file.
- Fragments can't use itself. Must avoid recursion. This can lead to duplicating fragments to get to nested data.
