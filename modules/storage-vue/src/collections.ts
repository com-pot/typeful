import CollectionsService from "@typeful/storage/CollectionsService";
import { inject } from "vue";

export const useCollections = () => inject('vtf-collections') as CollectionsService


export const collectionComponentProps = {
  page: {type: Number, default: 1},
}
