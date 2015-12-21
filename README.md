
# LITTLETABLE
What is Littletable?

Littletable is a 3 dimensional table data structure that backed by redis.  

What is the 3rd dimension?
The 3rd dimension is Time.  That is to say every time you overwrite a cell ( any row-col intersection ) the old data is 
kept.  All old data is tagged by time.  So you can go back in time on any cell or collection of cells.  Nothing is deleted.

Roadmap
=======

stage 1: proof of concept

        - get 3d table working as a node demo
            - user can create multiple tables
            - user can update cells
            - user can update rows
            - user can update ranges
            - user can retrieve versioned data
            - user can tag collections
            - user can list tables
            - user can create named ranges ( a pointer to a section of table )
            - user can create saved ranges ( a clone of the data of a range)


stage 2: alpha
        - move appropriate parts to LUA scripts

        - Journaling
        - user can get a realtime range
        
stage 3: beta
            

stage 4: release
