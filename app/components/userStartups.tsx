import { client } from "@/sanity/lib/client"
import { STARTUPS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries"
import CardDesign, {CardDesignType} from "@/app/components/cardDesign"

export default async function page ({id} : {id:string}) { //props
    const startups = await client.fetch(STARTUPS_BY_AUTHOR_QUERY, {id})
    return(
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ">
            {startups.length >= 1 ? startups.map((startup: CardDesignType) => (
                <CardDesign key={startup._id} post={startup} />
            )) : `You have not created any startups. Why not create one?`}
        </div>
    )
}