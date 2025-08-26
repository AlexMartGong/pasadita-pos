export const userTableStyles = {
    paper: {
        p: 2,
        height: "100%"
    },
    searchContainer: {
        mb: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 2
    },
    tableContainer: {
        height: 600,
        width: "100%"
    },
    actionsContainer: {
        display: 'flex',
        gap: 1
    },
    dataGrid: {
        "& .MuiDataGrid-root": {
            border: "none",
        },
        "& .MuiDataGrid-cell": {
            borderBottom: "none",
        },
        "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
            color: "#000",
            fontSize: 16,
        },
        "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#fff",
        },
    }
};

