//  // utils/getTilePanoramas.ts
//  
//  export interface TilePano {
//      panoId: string;
//      lat: number;
//      lng: number;
//      neighbors: number[];
//    }
//    
//    /**
//     * Converts lat/lng to tile coordinates at a given zoom level.
//     */
//    function latLngToTileCoords(lat: number, lng: number, zoom: number) {
//      //const tileSize = 256;
//      const scale = 1 << zoom;
//    
//      const worldCoordinateX = ((lng + 180) / 360) * scale;
//      const siny = Math.sin((lat * Math.PI) / 180);
//      const clippedSiny = Math.min(Math.max(siny, -0.9999), 0.9999);
//      const worldCoordinateY =
//        (0.5 - Math.log((1 + clippedSiny) / (1 - clippedSiny)) / (4 * Math.PI)) *
//        scale;
//    
//      return {
//        x: Math.floor(worldCoordinateX),
//        y: Math.floor(worldCoordinateY),
//        zoom,
//      };
//    }
//    
//    /**
//     * Fetches and parses panos within a tile, given lat/lng and zoom.
//     */
//    export async function getTilePanoramas(
//      lat: number,
//      lng: number,
//      zoom = 17
//    ): Promise<TilePano[]> {
//      const { x, y, zoom: z } = latLngToTileCoords(lat, lng, zoom);
//    
//      const url = `https://www.google.com/maps/photometa/ac/v1?pb=!1m2!1sapiv3!5sen!6m3!1i${x}!2i${y}!3i${z}`;
//    
//      try {
//        const res = await fetch(url);
//        const text = await res.text();
//    
//        // Clean up response
//        const jsonStr = text.replace(")]}'", '').trim();
//        const raw = JSON.parse(jsonStr);
//    
//        const panoArray = raw?.[1] as any[];
//    
//        if (!Array.isArray(panoArray)) return [];
//    
//        return panoArray
//        .map((entry: any) => {
//          const panoId = entry?.[0]?.[0]?.[1];
//          const lat = entry?.[0]?.[2]?.[0]?.[2];
//          const lng = entry?.[0]?.[2]?.[0]?.[3];
//          const neighbors = entry?.[1] ?? [];
//      
//          if (!panoId || typeof lat !== 'number' || typeof lng !== 'number') return null;
//      
//          return {
//            panoId,
//            lat,
//            lng,
//            neighbors,
//          } as TilePano;
//        })
//        .filter((pano): pano is TilePano => pano !== null); // ✅ This fixes the type
//      
//      } catch (err) {
//        console.error('Failed to fetch tile panos:', err);
//        return [];
//      }
//    }
//    