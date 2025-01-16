'use client'
import { Box, createTheme, ThemeProvider } from "@mui/material";
import { DataGrid, GridColDef ,GridToolbar} from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";

const theme = createTheme(
    {
        palette: {
            primary: { main: '#1976d2' },
        },
        
    },
    esES,
);
interface Props {
    
    columns:GridColDef[],
    rows:any[],
    showQuickFilter?: boolean,
    pageSize?:number,
  
}   
export const TableDataGridUI = ({columns,rows,showQuickFilter=true}:Props) => {
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ height: 700, width: 1 }}>
                <DataGrid
                    columns={columns}
                    rows={rows}
                    slots={{ toolbar: GridToolbar }}
                    getRowClassName={(params) =>
                        params.row?.FyHFinal ? 'bg-emerald-50' : 'bg-gray-100'
                    }
                    slotProps={{
                        toolbar: {
                            showQuickFilter: showQuickFilter,
                        },
                    }}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25, 50, 100]} 
                    pagination 
                    disableRowSelectionOnClick
                    sx={{
                        '& .MuiDataGrid-row:hover': {
                          backgroundColor: 'transparent',
                        },
                        '& .bold': {
                          fontWeight: 'bold',
                        },
                      }}
                />
            </Box>
        </ThemeProvider>

    )
}
