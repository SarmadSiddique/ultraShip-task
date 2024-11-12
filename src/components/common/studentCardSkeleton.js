const StudentCardSkeleton = () => {
    const SkeletonItem = ({ className }) => (
        <div className={`animate-pulse bg-gray-300 rounded ${className}`}></div>
    )
    return (
        <div className="flex items-center justify-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-lg px-2 rounded-xl shadow-lg p-4 max-w-md w-full transition-all duration-500 ease-out transform">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-baseline gap-2">
                        <SkeletonItem className="h-5 w-24" /> {/* Name */}
                        <SkeletonItem className="h-4 w-16 rounded-full bg-green-200" /> {/* Status */}
                    </div>
                    <SkeletonItem className="h-8 w-8 rounded-full" /> {/* Action button */}
                </div>

                <div className="flex flex-row gap-2 mb-3">
                    <SkeletonItem className="h-10 w-full" /> {/* Gender */}
                    <SkeletonItem className="h-10 w-full" /> {/* Phone */}
                    <SkeletonItem className="h-10 w-full" /> {/* Address */}
                </div>

                <div className="border-t border-gray-200 pt-2">
                    <SkeletonItem className="h-4 w-3/4 ml-auto" /> {/* Date */}
                </div>
            </div>
        </div>
    )
}
export default StudentCardSkeleton