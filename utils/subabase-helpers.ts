import { supabase } from '@/lib/supabaseClient';
import { DataBasePano, TagCategory } from '@/types';
export async function downloadAll(): Promise<DataBasePano[] | null> {
        const { data, error } = await supabase.from('pano-library-beta').select('*');
        console.log(error?.message)
        console.log(data)
        if (error) {
            console.warn(error);
            return null;
        }
        console.log("Download Successful")
        return data;
    }
    export async function downloadByTagKeyword(tag: string): Promise<DataBasePano[] | null> {
        const { data, error } = await supabase.rpc('get_panos_by_tag_keyword', {
            x: -1,
            y: -1,
            z: -1,
            t: tag,
          });
          console.log(error?.message)
          console.log(data)
          if (error) {
              console.warn(error);
              return null;
          }
          console.log("Download Successful")
          return data;
    }
    export async function downloadByTag(tag: string): Promise<DataBasePano[] | null> {
        const { data, error } = await supabase.rpc('get_panos_by_tag', {
            x: -1,
            y: -1,
            z: -1,
            t: tag,
          });
          console.log(error?.message)
          console.log(data)
          if (error) {
              console.warn(error);
              return null;
          }
          console.log("Download Successful")
          return data;
    }
    
    export async function downloadByCategoryAndTag(tag: TagCategory): Promise<DataBasePano[] | null> {
        const { data, error } = await supabase.rpc('get_panos_by_category_and_tag', {
            x: tag.x,
            y: tag.y,
            z: tag.z,
            t: tag.t
          });
          console.log(error?.message)
        console.log(data)
        if (error) {
            console.warn(error);
            return null;
        }
        console.log("Download Successful")
        return data;
    }