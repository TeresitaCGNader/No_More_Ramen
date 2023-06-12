import Link from 'next/link';

const Navbar = () => (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
            <span className="font-semibold text-xl tracking-tight">
                No More Ramen
            </span>
        </div>
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
            <div className="text-sm flex flex-grow gap-x-2 text-center items-center text-white">
                <Link href="/">
                    <span className="hover:border rounded-md p-2">Home</span>
                </Link>
                <Link href="/ingredients">
                    <span className="hover:border rounded-md p-2">
                        Ingredients
                    </span>
                </Link>
                <Link href="/recipes">
                    <span className="hover:border rounded-md p-2">Recipes</span>
                </Link>
                <Link href="/units">
                    <span className="hover:border rounded-md p-2">Units</span>
                </Link>
                <Link href="/users">
                    <span className="hover:border rounded-md p-2">Users</span>
                </Link>
                <Link href="/recipe-ingredients">
                    <span className="hover:border rounded-md p-2">
                        Recipe Ingredients
                    </span>
                </Link>
                <Link href="/ingredient-restrictions">
                    <span className="hover:border rounded-md p-2">
                        Ingredient Restrictions
                    </span>
                </Link>
                <Link href="/restrictions">
                    <span className="hover:border rounded-md p-2">
                        Restrictions
                    </span>
                </Link>
            </div>
        </div>
    </nav>
);

export default Navbar;
