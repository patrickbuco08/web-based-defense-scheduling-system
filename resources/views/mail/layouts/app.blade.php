<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'Defense Scheduling System')</title>
</head>

<body style="margin:0; padding:0; font-family: Arial, Helvetica, sans-serif; background-color:#f5f5f5;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; padding:20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0"
                    style="background-color:#ffffff; border-radius:8px; overflow:hidden;">

                    <!-- Header -->
                    <tr>
                        <td
                            style="background-color:#601818; padding:20px; text-align:center; color:#ffffff; font-size:20px; font-weight:bold;">
                            Defense Scheduling System
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:30px;">
                            @yield('content')
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td
                            style="background-color:#fafafa; padding:15px; text-align:center; font-size:12px; color:#666;">
                            &copy; {{ date('Y') }} City College of Tagaytay · All Rights Reserved
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>

</html>
