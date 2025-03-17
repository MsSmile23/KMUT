/* eslint-disable */

import { getUtilCurrent } from "../../Models/getUtilCurrent";
import { getBandCurrent } from "../../Models/getBandCurrent";

export const renderSource = (data) => {
    switch (data) {
        case 2: {
            return getUtilCurrent()
        }
        case 1: {
            return getBandCurrent()
        }
        default: {
            return getBandCurrent()
        }
    }
}