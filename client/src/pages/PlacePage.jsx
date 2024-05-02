import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axiosInstance from '@/utils/axios';

import Spinner from '@/components/ui/Spinner';
import AddressLink from '@/components/ui/AddressLink';
import BookingWidget from '@/components/ui/BookingWidget';
import PlaceGallery from '@/components/ui/PlaceGallery';
import PerksWidget from '@/components/ui/PerksWidget';

const PlacePage = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!id) {
      return '';
    }

    setLoading(true);

    const getPlace = async () => {
      const { data } = await axiosInstance.get(`/places/${id}`);
      setPlace(data.place);
      setComments(data.place.comments); // Assuming comments are included in the response
      setLoading(false);
    };

    //get current user
    const getCurrentUser = async () => {
      try {
        const { data } = await axiosInstance.get('places/user');
        setCurrentUser(data.id);
      } catch (error) {
        console.log(error);
      }
    };

    getCurrentUser();
    getPlace();
  }, [id]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleAddComment = async () => {
    try {
      const response = await axiosInstance.post(`/places/${id}/comments`, {
        comment,
      });
      setComments([...comments, response.data.comment]);
      setComment(''); // Clear the comment input after posting
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(`/places/${id}/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!place) {
    return null;
  }

  return (
    <div className="mt-4 overflow-x-hidden px-8 pt-20 ">
      {/* Place information */}
      <h1 className="text-3xl">{place.title}</h1>
      <AddressLink placeAddress={place.address} />
      <PlaceGallery place={place} />
      <div className="mb-8 mt-8 grid grid-cols-1 gap-8 md:grid-cols-[2fr_1fr]">
        <div className="">
          <div className="my-4 ">
            <h2 className="text-2xl font-semibold">Description</h2>
            {place.description}
          </div>
          Max number of guests: {place.maxGuests}
          <PerksWidget perks={place?.perks} />
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
      <div className="-mx-8 border-t bg-white px-8 py-8">
        <div>
          <h2 className="mt-4 text-2xl font-semibold">Extra Info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm leading-5 text-gray-700">
          {place.extraInfo}
        </div>
      </div>

      {/* Comment section */}
      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">Comments</h2>
        <div className="space-y-4">
          {comments?.map((c) => (
            <div key={c?._id} className="rounded-lg border bg-gray-100 p-4">
              <div className="mb-2 flex justify-between">
                <p className="font-semibold">{c?.user?.name}</p>
                <p className="text-gray-500">
                  {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-gray-700">{c?.comment}</p>
              {currentUser === c.user._id && (
                <button
                  style={{ marginTop: '15px' }}
                  onClick={() => handleDeleteComment(c?._id)}
                  className="inline-block rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition duration-300 ease-in-out hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
        {/* Add comment form */}
        <div className="mt-8">
          <textarea
            value={comment}
            onChange={handleCommentChange}
            placeholder="Write your comment here..."
            className="w-full rounded-lg border px-3 py-2"
          />
          <button
            onClick={handleAddComment}
            className="mb-5 mt-2 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlacePage;
