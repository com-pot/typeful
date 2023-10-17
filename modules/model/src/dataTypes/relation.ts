import { defineTypefulType } from "../dataTypes";

export default defineTypefulType({
    validate() {
        return true
    },
    sanitize() {
        console.warn("relation sanitize not implemented");
    },
})
