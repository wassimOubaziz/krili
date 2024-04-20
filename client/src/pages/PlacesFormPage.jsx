import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import axiosInstance from '@/utils/axios';

import AccountNav from '@/components/ui/AccountNav';
import Perks from '@/components/ui/Perks';
import PhotosUploader from '@/components/ui/PhotosUploader';
import Spinner from '@/components/ui/Spinner';

const PlacesFormPage = () => {
  const { id } = useParams();
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addedPhotos, setAddedPhotos] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    address: '',
    description: '',
    perks: [],
    extraInfo: '',
    checkIn: '',
    checkOut: '',
    maxGuests: 10,
    price: 500,
    category: '',
    rental: false,
    selling: false,
    religion: '',
  });

  const {
    title,
    address,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
    category,
    rental,
    selling,
    religion,
  } = formData;

  const isValidPlaceData = () => {
    if (title.trim() === '') {
      toast.error("Title can't be empty!");
      return false;
    } else if (address.trim() === '') {
      toast.error("Address can't be empty!");
      return false;
    } else if (addedPhotos.length < 5) {
      toast.error('Upload at least 5 photos!');
      return false;
    } else if (description.trim() === '') {
      toast.error("Description can't be empty!");
      return false;
    } else if (category === '') {
      toast.error('Please select a category!');
      return false;
    } else if (category !== 'trips' && !rental && !selling) {
      toast.error('Please select rental or selling option!');
      return false;
    }

    return true;
  };

  const handleFormData = (e) => {
    const { name, value, type, checked } = e.target;
    // If the input is not a checkbox, update 'formData' directly
    if (type !== 'checkbox') {
      setFormData({ ...formData, [name]: value });
      return;
    }

    // If type is checkbox (perks)
    if (type === 'checkbox') {
      const currentPerks = [...perks];
      let updatedPerks = [];

      // Check if the perk is already in perks array
      if (currentPerks.includes(name)) {
        updatedPerks = currentPerks.filter((perk) => perk !== name);
      } else {
        updatedPerks = [...currentPerks, name];
      }
      setFormData({ ...formData, perks: updatedPerks });
    }
  };

  const handleRentalCheckbox = (e) => {
    const { checked } = e.target;
    if (checked) {
      setFormData({ ...formData, rental: true, selling: false });
    } else {
      setFormData({ ...formData, rental: false });
    }
  };

  const handleSellingCheckbox = (e) => {
    const { checked } = e.target;
    if (checked) {
      setFormData({ ...formData, selling: true, rental: false });
    } else {
      setFormData({ ...formData, selling: false });
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    axiosInstance.get(`/places/${id}`).then((response) => {
      const { place } = response.data;
      // update the state of formData
      for (let key in formData) {
        if (place.hasOwnProperty(key)) {
          setFormData((prev) => ({
            ...prev,
            [key]: place[key],
          }));
        }
      }

      // update photos state separately
      setAddedPhotos([...place.photos]);

      setLoading(false);
    });
  }, [id]);

  const preInput = (header, description) => {
    return (
      <>
        <h2 className="mt-4 text-2xl">{header}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </>
    );
  };

  const savePlace = async (e) => {
    e.preventDefault();

    const formDataIsValid = isValidPlaceData();
    const placeData = { ...formData, addedPhotos };

    // Make API call only if formData is valid
    if (formDataIsValid) {
      if (id) {
        // update existing place
        const { data } = await axiosInstance.put('/places/update-place', {
          id,
          ...placeData,
        });
      } else {
        // new place
        const { data } = await axiosInstance.post(
          '/places/add-places',
          placeData,
        );
      }
      setRedirect(true);
    }
  };

  if (redirect) {
    return <Navigate to={'/account/places'} />;
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="p-4">
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput(
          'Title',
          'Title for your place. Should be short and catchy as in advertisement',
        )}
        <input
          type="text"
          name="title"
          value={title}
          onChange={handleFormData}
          placeholder="Title, for example: My lovely apt"
        />

        {preInput('Address', 'Address to this place')}
        <input
          type="text"
          name="address"
          value={address}
          onChange={handleFormData}
          placeholder="Address"
        />

        {preInput('Photos', 'More = Better')}

        <PhotosUploader
          addedPhotos={addedPhotos}
          setAddedPhotos={setAddedPhotos}
        />

        {preInput('Description', 'Description of the place')}
        <textarea
          value={description}
          name="description"
          onChange={handleFormData}
        />

        {preInput('Perks', 'Select all the perks of your place')}
        <Perks selected={perks} handleFormData={handleFormData} />

        {preInput('Extra Info', 'House rules, etc.')}
        <textarea
          value={extraInfo}
          name="extraInfo"
          onChange={handleFormData}
        />

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1">
          <div className="mb-4">
            <label
              htmlFor="category"
              className="mb-1 mt-2 block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={handleFormData}
              className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50"
            >
              <option value="">Select Category</option>
              <option value="cars">Cars</option>
              <option value="bicycles">Bicycles</option>
              <option value="trips">Trips</option>
              <option value="houses">Houses</option>
            </select>
          </div>
          <div>
            <div className="mb-4">
              <label className="mb-1 mt-2 block text-sm font-medium text-gray-700">
                Renting
              </label>
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="rental"
                    checked={rental}
                    onChange={handleRentalCheckbox}
                    className="form-checkbox h-5 w-5 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-gray-700">Renting</span>
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label className="mb-1 mt-2 block text-sm font-medium text-gray-700">
                Selling
              </label>
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="selling"
                    checked={selling}
                    onChange={handleSellingCheckbox}
                    className="form-checkbox h-5 w-5 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-gray-700">Selling</span>
                </label>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="religion"
              className="mb-1 mt-2 block text-sm font-medium text-gray-700"
            >
              Religion
            </label>
            <select
              id="religion"
              name="religion"
              value={religion}
              onChange={handleFormData}
              className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50"
            >
              <option value="">Select Religion</option>
              <option value="islamic">Islamic</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="maxGuests"
              className="mb-1 mt-2 block text-sm font-medium text-gray-700"
            >
              Max no. of guests
            </label>
            <input
              id="maxGuests"
              type="number"
              name="maxGuests"
              value={maxGuests}
              onChange={handleFormData}
              placeholder="1"
              className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="mb-1 mt-2 block text-sm font-medium text-gray-700"
            >
              Price per night
            </label>
            <input
              id="price"
              type="number"
              name="price"
              value={price}
              onChange={handleFormData}
              placeholder="1"
              className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50"
            />
          </div>
        </div>

        <button className="mx-auto my-4 flex rounded-full bg-primary px-20 py-3 text-xl font-semibold text-white">
          Save
        </button>
      </form>
    </div>
  );
};

export default PlacesFormPage;
