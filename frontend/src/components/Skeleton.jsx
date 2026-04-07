import React from 'react'
import './Skeleton.scss'

const Skeleton = ({ width, height, className = '', variant = 'rectangle' }) => {
    const style = {
        width: width || '100%',
        height: height || '1rem',
    }

    return (
        <div
            className={`skeleton skeleton--${variant} ${className}`}
            style={style}
        />
    )
}

const SkeletonText = ({ lines = 3, className = '' }) => {
    return (
        <div className={`skeleton-text ${className}`}>
            {Array.from({ length: lines }, (_, i) => (
                <Skeleton
                    key={i}
                    height="1rem"
                    width={i === lines - 1 ? '60%' : '100%'}
                    className="skeleton-text__line"
                />
            ))}
        </div>
    )
}

const SkeletonCard = ({ className = '' }) => {
    return (
        <div className={`skeleton-card ${className}`}>
            <Skeleton height="200px" variant="rectangle" className="skeleton-card__image" />
            <div className="skeleton-card__content">
                <Skeleton height="1.5rem" width="80%" className="skeleton-card__title" />
                <SkeletonText lines={2} className="skeleton-card__text" />
            </div>
        </div>
    )
}

export { Skeleton, SkeletonText, SkeletonCard }
export default Skeleton