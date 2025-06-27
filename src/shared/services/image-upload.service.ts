import { supabase } from '@common/utils';
import { v4 as uuidv4 } from 'uuid';

export const uploadImageToSupabase = async (
  fileBuffer: Buffer,
  mimetype: string
) => {
  const extension = mimetype.split('/')[1];
  const fileName = `${uuidv4()}.${extension}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, fileBuffer, {
      contentType: mimetype,
    });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return publicUrl?.publicUrl;
};
