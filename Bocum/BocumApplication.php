<?php

namespace Bocum;

use Illuminate\Foundation\Application as BaseApplication;

class BocumApplication extends BaseApplication
{
    /**
     * Get the path to the application "app" directory.
     *
     * @param  string  $path
     * @return string
     */
    public function path($path = '')
    {
        $appPath = $this->appPath ?: $this->basePath.DIRECTORY_SEPARATOR.'Bocum';

        return $appPath.($path ? DIRECTORY_SEPARATOR.$path : $path);
    }

}
