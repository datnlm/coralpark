// import { orderBy } from 'lodash';
// import { Icon } from '@iconify/react';
// import plusFill from '@iconify/icons-eva/plus-fill';
// import { Link as RouterLink } from 'react-router-dom';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import { useEffect, useCallback, useState } from 'react';
// // material
// import { Box, Grid, Button, Skeleton, Container, Stack } from '@material-ui/core';
// // redux
// import { useDispatch, useSelector } from '../../redux/store';
// import { getPostsInitial, getMorePosts } from '../../redux/slices/blog';
// // hooks
// import useSettings from '../../hooks/useSettings';
// // routes
// import { PATH_DASHBOARD } from '../../routes/paths';
// // @types
// import { Post, BlogState } from '../../@types/blog';
// // components
// import Page from '../../components/Page';
// import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../../components/_dashboard/blog';

// // ----------------------------------------------------------------------

// const SORT_OPTIONS = [
//   { value: 'latest', label: 'Latest' },
//   { value: 'popular', label: 'Popular' },
//   { value: 'oldest', label: 'Oldest' }
// ];

// // ----------------------------------------------------------------------

// const applySort = (posts: Post[], sortBy: string) => {
//   if (sortBy === 'latest') {
//     return orderBy(posts, ['createdAt'], ['desc']);
//   }
//   if (sortBy === 'oldest') {
//     return orderBy(posts, ['createdAt'], ['asc']);
//   }
//   if (sortBy === 'popular') {
//     return orderBy(posts, ['view'], ['desc']);
//   }
//   return posts;
// };

// const SkeletonLoad = (
//   <Grid container spacing={3} sx={{ mt: 2 }}>
//     {[...Array(4)].map((_, index) => (
//       <Grid item xs={12} md={3} key={index}>
//         <Skeleton variant="rectangular" width="100%" sx={{ height: 200, borderRadius: 2 }} />
//         <Box sx={{ display: 'flex', mt: 1.5 }}>
//           <Skeleton variant="circular" sx={{ width: 40, height: 40 }} />
//           <Skeleton variant="text" sx={{ mx: 1, flexGrow: 1 }} />
//         </Box>
//       </Grid>
//     ))}
//   </Grid>
// );

// export default function BlogPosts() {
//   const { themeStretch } = useSettings();
//   const dispatch = useDispatch();
//   const [filters, setFilters] = useState('latest');
//   const { posts, hasMore, index, step } = useSelector((state: { blog: BlogState }) => state.blog);

//   const sortedPosts = applySort(posts, filters);
//   const onScroll = useCallback(() => dispatch(getMorePosts()), [dispatch]);

//   useEffect(() => {
//     dispatch(getPostsInitial(index, step));
//   }, [dispatch, index, step]);

//   const handleChangeSort = (value?: string) => {
//     if (value) {
//       setFilters(value);
//     }
//   };

//   return (
//     <Page title="Blog: Posts | Minimal-UI">
//       <Container maxWidth={themeStretch ? false : 'lg'}>
//         <HeaderBreadcrumbs
//           heading="Blog"
//           links={[
//             { name: 'Dashboard', href: PATH_DASHBOARD.root },
//             { name: 'Blog', href: PATH_DASHBOARD.blog.root },
//             { name: 'Posts' }
//           ]}
//           action={
//             <Button
//               variant="contained"
//               component={RouterLink}
//               to={PATH_DASHBOARD.blog.newPost}
//               startIcon={<Icon icon={plusFill} />}
//             >
//               New Post
//             </Button>
//           }
//         />

//         <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
//           <BlogPostsSearch />
//           <BlogPostsSort query={filters} options={SORT_OPTIONS} onSort={handleChangeSort} />
//         </Stack>

//         <InfiniteScroll
//           next={onScroll}
//           hasMore={hasMore}
//           loader={SkeletonLoad}
//           dataLength={posts.length}
//           style={{ overflow: 'inherit' }}
//         >
//           <Grid container spacing={3}>
//             {sortedPosts.map((post, index) => (
//               <BlogPostCard key={post.id} post={post} index={index} />
//             ))}
//           </Grid>
//         </InfiniteScroll>
//       </Container>
//     </Page>
//   );
// }

import * as React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
  Stack,
  Container
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Link as RouterLink } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';

function createData(name: string) {
  return {
    name,
    coral: [
      {
        name: 'Ten coral 1',
        scientific: 'Ten khoa hoc',
        status: 3
      },
      {
        name: '2020-01-02',
        scientific: 'Anonymous',
        status: 1
      }
    ]
  };
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <TableRow sx={{ p: { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Coral
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Scientific name</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.coral.map((coralRow) => (
                    <TableRow key={coralRow.name}>
                      <TableCell component="th" scope="row">
                        {coralRow.name}
                      </TableCell>
                      <TableCell>{coralRow.scientific}</TableCell>
                      <TableCell>{coralRow.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </div>
  );
}

const rows = [
  createData('Nha Trang'),
  createData('Phú Quốc'),
  createData('Kiên Giang'),
  createData('Phan Thiết'),
  createData('Vĩnh Long')
];

export default function CollapsibleTable() {
  return (
    <Page title="CoralArea: List">
      <Container>
        <HeaderBreadcrumbs
          heading="Coral Area"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Cora Area', href: PATH_DASHBOARD.blog.root },
            { name: 'List' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.user.profile}
              startIcon={<Icon icon={plusFill} />}
            >
              New CoralArea
            </Button>
          }
        />

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell>Coral Area</TableCell>
                  {/* <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <Row key={row.name} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Container>
    </Page>
  );
}
