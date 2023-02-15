import React from 'react'

const Rating = ({ text, value }) => {
  return (
    <span>
      <i
        className={
          value >= 1
            ? 'fa-solid fa-star'
            : value >= 0.5
            ? 'fa-solid fa-star-half-stroke'
            : 'fa-regular fa-star'
        }
      ></i>
    </span>
  )
}

export default Rating
