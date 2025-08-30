import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Orders first with descending date
      S.listItem()
        .title('Order')
        .schemaType('order')
        .child(
          S.documentTypeList('order')
            .title('Order')
            .filter('_type == "order"')
            .defaultOrdering([{field: 'orderDate', direction: 'desc'}])
        ),
      // The rest of document types
      ...S.documentTypeListItems().filter((li) => li.getId() !== 'order'),
    ])
