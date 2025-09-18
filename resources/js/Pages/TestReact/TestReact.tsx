import React, { useEffect } from 'react';

function TestReact() {
    useEffect(() => {
        console.log('TestReact component mounted!');
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Laravel + React is working! 🎉
                    </h1>
                    <p className="text-gray-600 mb-4">
                        This is a React component rendered in your Laravel application.
                    </p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-md">
                        <p className="text-blue-700">Check the browser console to see the component mount message.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TestReact;
