import { Icon } from '@iconify/react';
import { paramCase } from 'change-case';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText
} from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
import useLocales from '../../../../hooks/useLocales';
// ----------------------------------------------------------------------

type TechnicianMoreMenuProps = {
  onDelete: VoidFunction;
  id: string;
  status: any;
};

export default function TechnicianMoreMenu({ onDelete, id, status }: TechnicianMoreMenuProps) {
  const { translate } = useLocales();
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsOpen(false);
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {status !== 0 && (
          <MenuItem onClick={handleClickOpen} sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Icon icon={trash2Outline} width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary={translate('button.menu.delete')}
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </MenuItem>
        )}

        <div>
          <Dialog open={open} onClose={handleClose} aria-labelledby="draggable-dialog-title">
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              {translate('message.title.confirm-delete')}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>{translate('message.confirm-delete')}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose}>
                {translate('button.save.cancel')}
              </Button>
              <Button
                onClick={(event) => {
                  onDelete();
                  handleClose();
                }}
              >
                {translate('button.save.confirm')}
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        <MenuItem
          component={RouterLink}
          to={`${PATH_DASHBOARD.staff.root}/technician/${paramCase(id)}/edit`}
          sx={{ color: 'text.secondary' }}
        >
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary={translate('button.menu.edit')}
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
