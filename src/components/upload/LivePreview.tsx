import { isString } from 'lodash';
import { Icon } from '@iconify/react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import fileFill from '@iconify/icons-eva/file-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import { motion, AnimatePresence } from 'framer-motion';
// material
import { alpha, Theme, styled } from '@material-ui/core/styles';
import {
  Box,
  List,
  Stack,
  Paper,
  Button,
  ListItem,
  Typography,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@material-ui/core';
// utils
import { fData } from '../../utils/formatNumber';
//
import { MIconButton } from '../@material-extend';
import { varFadeInRight } from '../animate';
// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  display: 'flex',
  textAlign: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
  [theme.breakpoints.up('md')]: { textAlign: 'left', flexDirection: 'row' }
}));

// ----------------------------------------------------------------------
type LivePreviewProps = {
  files: string[];
  onRemove: (id: string) => void;
};

export default function LivePreview({ files, onRemove }: LivePreviewProps) {
  return (
    <Box sx={{ width: '100%' }}>
      <List disablePadding sx={{ my: 3 }}>
        <AnimatePresence>
          {files.map((v: any, index: number) => {
            return (
              <ListItem
                key={index}
                component={motion.div}
                {...varFadeInRight}
                sx={{
                  p: 0,
                  m: 0.5,
                  width: 80,
                  height: 80,
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'inline-flex'
                }}
              >
                <Paper
                  variant="outlined"
                  component="img"
                  src={v.imageUrl}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }}
                />
                <Box sx={{ top: 6, right: 6, position: 'absolute' }}>
                  <MIconButton
                    size="small"
                    onClick={() => onRemove(v.id)}
                    sx={{
                      p: '2px',
                      color: 'common.white',
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48)
                      }
                    }}
                  >
                    <Icon icon={closeFill} />
                  </MIconButton>
                </Box>
              </ListItem>
            );
          })}
        </AnimatePresence>
      </List>
    </Box>
  );
}
