import { GridLocaleText } from '@mui/x-data-grid';

export const UZ_GRID_LOCALE_TEXT: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: "Qatorlar yo'q",
  noResultsOverlayLabel: 'Natija topilmadi',

  // Density selector toolbar button text
  toolbarDensity: 'Zichlik',
  toolbarDensityLabel: 'Zichlik',
  toolbarDensityCompact: 'Ixcham',
  toolbarDensityStandard: 'Standart',
  toolbarDensityComfortable: 'Qulay',

  // Columns selector toolbar button text
  toolbarColumns: 'Ustunlar',
  toolbarColumnsLabel: 'Ustunlarni tanlash',

  // Filters toolbar button text
  toolbarFilters: 'Filtrlar',
  toolbarFiltersLabel: "Filtrlarni ko'rsatish",
  toolbarFiltersTooltipHide: 'Filtrlarni yashirish',
  toolbarFiltersTooltipShow: "Filtrlarni ko'rsatish",
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} ta faol filtr` : `${count} ta faol filtr`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Qidirish…',
  toolbarQuickFilterLabel: 'Qidirish',
  toolbarQuickFilterDeleteIconLabel: 'Tozalash',

  // Export selector toolbar button text
  toolbarExport: 'Eksport',
  toolbarExportLabel: 'Eksport',
  toolbarExportCSV: 'CSV yuklab olish',
  toolbarExportPrint: 'Chop etish',
  toolbarExportExcel: 'Excel yuklab olish',

  // Columns management text
  columnsManagementSearchTitle: 'Qidirish',
  columnsManagementNoColumns: "Ustunlar yo'q",
  columnsManagementShowHideAllText: "Barchasini ko'rsatish/yashirish",
  columnsManagementReset: 'Qayta tiklash',

  // Filter panel text
  filterPanelAddFilter: "Filtr qo'shish",
  filterPanelRemoveAll: 'Barchasini olib tashlash',
  filterPanelDeleteIconLabel: "O'chirish",
  filterPanelLogicOperator: 'Mantiqiy operator',
  filterPanelOperator: 'Operator',
  filterPanelOperatorAnd: 'Va',
  filterPanelOperatorOr: 'Yoki',
  filterPanelColumns: 'Ustunlar',
  filterPanelInputLabel: 'Qiymat',
  filterPanelInputPlaceholder: 'Filtr qiymati',

  // Filter operators text
  filterOperatorContains: "o'z ichiga oladi",
  filterOperatorEquals: 'teng',
  filterOperatorStartsWith: 'bilan boshlanadi',
  filterOperatorEndsWith: 'bilan tugaydi',
  filterOperatorIs: 'bu',
  filterOperatorNot: 'emas',
  filterOperatorAfter: 'keyin',
  filterOperatorOnOrAfter: 'yoki undan keyin',
  filterOperatorBefore: 'oldin',
  filterOperatorOnOrBefore: 'yoki undan oldin',
  filterOperatorIsEmpty: "bo'sh",
  filterOperatorIsNotEmpty: "bo'sh emas",
  filterOperatorIsAnyOf: 'quyidagilardan biri',

  // Header filter operators text
  headerFilterOperatorContains: "o'z ichiga oladi",
  headerFilterOperatorEquals: 'teng',
  headerFilterOperatorStartsWith: 'bilan boshlanadi',
  headerFilterOperatorEndsWith: 'bilan tugaydi',
  headerFilterOperatorIs: 'bu',
  headerFilterOperatorNot: 'emas',
  headerFilterOperatorAfter: 'keyin',
  headerFilterOperatorOnOrAfter: 'yoki undan keyin',
  headerFilterOperatorBefore: 'oldin',
  headerFilterOperatorOnOrBefore: 'yoki undan oldin',
  headerFilterOperatorIsEmpty: "bo'sh",
  headerFilterOperatorIsNotEmpty: "bo'sh emas",
  headerFilterOperatorIsAnyOf: 'quyidagilardan biri',

  // Filter values text
  filterValueAny: 'har qanday',
  filterValueTrue: "to'g'ri",
  filterValueFalse: "noto'g'ri",

  // Column menu text
  columnMenuLabel: 'Menyu',
  columnMenuShowColumns: "Ustunlarni ko'rsatish",
  columnMenuManageColumns: 'Ustunlarni boshqarish',
  columnMenuFilter: 'Filtr',
  columnMenuHideColumn: 'Yashirish',
  columnMenuUnsort: 'Tartiblashni bekor qilish',
  columnMenuSortAsc: "O'sish bo'yicha tartiblash",
  columnMenuSortDesc: "Kamayish bo'yicha tartiblash",

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} ta faol filtr` : `${count} ta faol filtr`,
  columnHeaderFiltersLabel: "Filtrlarni ko'rsatish",
  columnHeaderSortIconLabel: 'Tartiblash',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} qator tanlandi`
      : `${count.toLocaleString()} qator tanlandi`,

  // Total row amount footer text
  footerTotalRows: 'Jami qatorlar:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Belgilash',
  checkboxSelectionSelectAllRows: 'Barcha qatorlarni tanlash',
  checkboxSelectionUnselectAllRows: 'Barcha qatorlarni bekor qilish',
  checkboxSelectionSelectRow: 'Qatorni tanlash',
  checkboxSelectionUnselectRow: 'Qatorni bekor qilish',

  // Boolean cell text
  booleanCellTrueLabel: 'ha',
  booleanCellFalseLabel: "yo'q",

  // Actions cell more text
  actionsCellMore: "ko'proq",

  // Column pinning text
  pinToLeft: 'Chapga mahkamlash',
  pinToRight: "O'ngga mahkamlash",
  unpin: 'Mahkamlamani bekor qilish',

  // Tree Data
  treeDataGroupingHeaderName: 'Guruh',
  treeDataExpand: "ko'rish",
  treeDataCollapse: "yig'ish",

  // Grouping columns
  groupingColumnHeaderName: 'Guruh',
  groupColumn: (name) => `${name} bo'yicha guruhlash`,
  unGroupColumn: (name) => `${name} bo'yicha guruhni bekor qilish`,

  // Master/detail
  detailPanelToggle: 'Batafsil panelni almashtirish',
  expandDetailPanel: 'Kengaytirish',
  collapseDetailPanel: "Yig'ish",

  // Row reordering text
  rowReorderingHeaderName: 'Qatorlarni qayta tartiblash',

  // Aggregation
  aggregationMenuItemHeader: 'Birlashtirish',
  aggregationFunctionLabelSum: 'summa',
  aggregationFunctionLabelAvg: "o'rtacha",
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'max',
  aggregationFunctionLabelSize: 'hajm',
};

export const uzUZDataGrid = {
  components: {
    MuiDataGrid: {
      defaultProps: {
        localeText: UZ_GRID_LOCALE_TEXT,
      },
    },
    MuiTablePagination: {
      defaultProps: {
        labelRowsPerPage: 'Sahifadagi qatorlar:',
        labelDisplayedRows: ({ from, to, count }: { from: number; to: number; count: number }) =>
          `${from}–${to} / ${count !== -1 ? count : `${to} dan ko'p`}`,
      },
    },
  },
};
