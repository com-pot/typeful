import ValueTypes from "@typeful/types/ValueTypes";
import { inject } from "vue";

export const useValueTypes = () => inject('vtf-valueTypes') as ValueTypes
