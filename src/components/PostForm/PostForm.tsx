import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';
import { IPost } from '../../types';
import { exhibitActions } from '../../api/exhibitActions';
import { socketService } from '../../services/socketService';

interface PostFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  post?: IPost;
}

const PostSchema = Yup.object().shape({
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
  image: Yup.mixed()
    .test('fileRequired', 'Image is required', function (value) {
      if (this.parent.post) return true; // Не вимагаємо файл при редагуванні
      return value !== null;
    })
});

export const PostForm: React.FC<PostFormProps> = ({
  open,
  onClose,
  onSuccess,
  post
}) => {
  const handleSubmit = async (values: { description: string, image: File | null }, { setSubmitting, setStatus }: any) => {
    try {
      const formData = new FormData();
      formData.append('description', values.description);
      if (values.image) {
        formData.append('image', values.image);
      }

      if (post) {
        await exhibitActions.updatePost(post.id, { description: values.description });
      } else {
        await exhibitActions.createPost(formData);
        // Відправляємо сповіщення через сокет
        const socket = socketService.getSocket();
        socket.emit('newPost', { message: 'New post has been created!' });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save post:', error);
      setStatus('Failed to save post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{post ? 'Edit Post' : 'Create New Post'}</DialogTitle>
      <Formik
        initialValues={{
          description: post?.description || '',
          image: null as File | null
        }}
        validationSchema={PostSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, setFieldValue, status }) => (
          <Form>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Field
                  name="description"
                  as={TextField}
                  label="Description"
                  multiline
                  rows={4}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
                
                {!post && (
                  <Box>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0];
                        if (file) setFieldValue('image', file);
                      }}
                      style={{ display: 'none' }}
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        fullWidth
                      >
                        Choose Image
                      </Button>
                    </label>
                    {errors.image && touched.image && (
                      <Typography color="error" variant="caption" display="block" sx={{ mt: 1 }}>
                        {errors.image}
                      </Typography>
                    )}
                  </Box>
                )}
                
                {status && (
                  <Box color="error.main" mt={1}>
                    {status}
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
