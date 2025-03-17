import { getReports } from './getReports/getReports';
import { postReport } from './postReport/postReport';
import { downloadReportById } from './downloadReportById/downloadReportById';
import { patchReportById } from './patchReportById/patchReportById';
import { deleteReportById } from './deleteReportById/deleteReportById';
import { getReportById } from './getReportById/getReportById';

export default {
    getReports,
    getReportById,
    postReport,
    downloadReportById,
    patchReportById,
    deleteReportById
}