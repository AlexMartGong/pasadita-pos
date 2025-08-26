import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

export const ConfirmDialog = ({showConfirmDialog, handleCancelBack, modifiedProductsCount, handleConfirmBack}) => {

    return (
        <Dialog
            open={showConfirmDialog}
            onClose={handleCancelBack}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
        >
            <DialogTitle id="confirm-dialog-title">
                Cambios sin guardar
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-dialog-description">
                    Tienes {modifiedProductsCount} cambios sin guardar. ¿Estás seguro de que quieres salir sin
                    guardar los cambios?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancelBack} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleConfirmBack} color="error" autoFocus>
                    Salir sin guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}