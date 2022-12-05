/* eslint-disable spaced-comment */
/* eslint-disable prettier/prettier */

import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, //tells apollo we will take care of everything.
    read(existing = [], { args, cache }) {
        console.log( { existing, args, cache })
        const { skip, first } = args;

        //read the number of items on the page from the cache 

        const data = cache.readQuery({ query: PAGINATION_QUERY});
        const count = data?._allProductsMeta?.count;
        const page = skip / first + 1;
        const pages = Math.ceil(count/first);

        //first ask the read function for those items 
        const items = existing.slice(skip, skip + first).filter((x) => x);
        if(items.length && items.length !== first && page === pages){
            return items;
        }
        
        if(items.length !== first){
            // we don't have any items we must fetch them
            return false;
        };

        //if there are items just return them from the cache

        if(items.length){
            console.log(`There are ${items.length} items in cache.`);
            return items;
        };

        return false; //fall back to network if something goes weird.

        //we can do one of two things

        //first return items because they are in cache

        //second return false which will make a network call
    },

    merge(existing, incoming, { args }) {
        const { skip, first } = args;

        //this runs when the apollo client comes back from the network call
        console.log(`Merging items from the network ${incoming.length}`);
        const merged = existing ? existing.slice(0): [];
        for(let i = skip; i < skip + incoming.length; ++i){
            merged[i] = incoming[ i - skip ];
        };
        console.log(merged)
        //finally we return the merged items 
        return merged;

    },
  };
}
